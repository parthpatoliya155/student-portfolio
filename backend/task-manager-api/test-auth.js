/*
  test-auth.js
  Quick Auth Flow Verification Script
  Tests: register → login → GET /auth/me → GET /tasks (protected)
*/

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { spawn } = require('child_process');

const PORT = 5001; // Use a different port to not conflict with running server
const BASE_URL = `http://localhost:${PORT}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runAuthTests() {
  let passed = 0;
  let failed = 0;
  let token = null;

  const test = async (name, url, options, expectedStatus, bodyCheck) => {
    console.log(`\n--- Test: ${name} ---`);
    console.log(`${options.method || 'GET'} ${url}`);
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch(e) {}
      
      console.log(`Status: ${res.status}`);
      if (data) console.log(`Body: ${JSON.stringify(data, null, 2)}`);

      if (res.status !== expectedStatus) {
        console.log(`❌ FAIL: Expected ${expectedStatus}, got ${res.status}`);
        failed++;
        return null;
      }
      if (bodyCheck && data) {
        try { bodyCheck(data); }
        catch(e) { console.log(`❌ FAIL: ${e.message}`); failed++; return null; }
      }
      console.log('✅ PASS');
      passed++;
      return data;
    } catch(err) {
      console.log(`❌ FAIL: ${err.message}`);
      failed++;
      return null;
    }
  };

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'password123';
  const headers = { 'Content-Type': 'application/json' };

  console.log('\n=== Starting Auth Flow Tests ===\n');

  // 1. Register
  const regData = await test('Register new user', `${BASE_URL}/auth/register`, {
    method: 'POST', headers,
    body: JSON.stringify({ email: testEmail, password: testPassword })
  }, 201, (d) => {
    if (!d.user || !d.user.id) throw new Error('No user.id in response');
    if (!d.user.email) throw new Error('No user.email in response');
  });

  // 2. Register Duplicate
  await test('Register duplicate email (should fail)', `${BASE_URL}/auth/register`, {
    method: 'POST', headers,
    body: JSON.stringify({ email: testEmail, password: testPassword })
  }, 400, (d) => {
    if (!d.details?.email) throw new Error('Expected email duplicate error');
  });

  // 3. Validation - Missing email
  await test('Register with invalid email', `${BASE_URL}/auth/register`, {
    method: 'POST', headers,
    body: JSON.stringify({ email: 'notanemail', password: 'password123' })
  }, 400, (d) => {
    if (!d.details?.email) throw new Error('Expected email validation error');
  });

  // 4. Login wrong password
  await test('Login with wrong password', `${BASE_URL}/auth/login`, {
    method: 'POST', headers,
    body: JSON.stringify({ email: testEmail, password: 'wrongpassword' })
  }, 401, (d) => {
    if (!d.error) throw new Error('Expected error message');
  });

  // 5. Login success
  const loginData = await test('Login with correct credentials', `${BASE_URL}/auth/login`, {
    method: 'POST', headers,
    body: JSON.stringify({ email: testEmail, password: testPassword })
  }, 200, (d) => {
    if (!d.token) throw new Error('No token in response');
    if (!d.user) throw new Error('No user in response');
  });
  if (loginData) token = loginData.token;

  // 6. GET /auth/me
  await test('GET /auth/me (protected)', `${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }, 200, (d) => {
    if (!d.user?.email) throw new Error('No user.email in /me response');
  });

  // 7. GET /auth/me without token
  await test('GET /auth/me without token (should be 401)', `${BASE_URL}/auth/me`, {
    method: 'GET'
  }, 401);

  // 8. POST /tasks without token (should be 401)
  await test('POST /tasks without token (should be 401)', `${BASE_URL}/tasks`, {
    method: 'POST', headers,
    body: JSON.stringify({ title: 'Unauthorized task' })
  }, 401);

  // 9. Create task with token
  let taskId = null;
  const taskData = await test('POST /tasks with valid token', `${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { ...headers, 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ title: 'Auth Test Task', priority: 'high' })
  }, 201, (d) => {
    if (!d._id) throw new Error('No task _id');
    if (!d.user) throw new Error('No user field on task');
  });
  if (taskData) taskId = taskData._id;

  // 10. GET /tasks (only user's tasks)
  await test('GET /tasks (user scoped)', `${BASE_URL}/tasks`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  }, 200, (d) => {
    if (!Array.isArray(d)) throw new Error('Expected array');
    if (!d.find(t => t._id === taskId)) throw new Error('Created task not in list');
  });

  // 11. DELETE task
  if (taskId) {
    await test('DELETE /tasks/:id', `${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }, 200, (d) => {
      if (!d.message?.includes('deleted successfully')) throw new Error('Bad delete message');
    });
  }

  console.log(`\n============================`);
  console.log(`Auth Tests Finished!`);
  console.log(`Passed: ${passed}/${passed + failed}`);
  console.log(`Failed: ${failed}/${passed + failed}`);
  console.log(`============================`);

  serverProcess.kill('SIGTERM');
  await sleep(500);
  process.exit(failed > 0 ? 1 : 0);
}

// Start server on test port
const serverProcess = spawn('node', [path.join(__dirname, 'src', 'server.js')], {
  stdio: 'pipe', cwd: __dirname,
  env: { ...process.env, PORT: String(PORT) }
});

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(`[SERVER] ${output}`);
  if (output.includes(`Server running on port ${PORT}`)) {
    runAuthTests();
  }
});

serverProcess.stderr.on('data', (data) => {
  process.stderr.write(`[SERVER ERR] ${data.toString()}`);
});

setTimeout(() => {
  console.error('Test timeout - forcing exit');
  serverProcess.kill();
  process.exit(1);
}, 30000);
