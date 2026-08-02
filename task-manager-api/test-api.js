const { spawn } = require('child_process');
const path = require('path');

const PORT = 5000;
const baseUrl = `http://localhost:${PORT}`;

// Function to wait a short moment
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
    let passed = 0;
    let failed = 0;

    const assertRes = async (name, endpoint, options, expectedStatus, bodyAssertion) => {
        console.log(`\n--- Test: ${name} ---`);
        console.log(`Request: ${options.method || 'GET'} ${endpoint}`);
        if (options.headers) console.log(`Headers: ${JSON.stringify(options.headers)}`);
        if (options.body) console.log(`Body: ${options.body}`);

        try {
            const res = await fetch(`${baseUrl}${endpoint}`, options);
            console.log(`Response Status: ${res.status}`);
            
            let data = null;
            const text = await res.text();
            try {
                if (text) data = JSON.parse(text);
            } catch (e) {
                console.log(`Response Raw Text: ${text}`);
            }

            if (data) {
                console.log(`Response Body: ${JSON.stringify(data, null, 2)}`);
            }

            if (res.status !== expectedStatus) {
                console.log(`❌ FAIL: Expected status ${expectedStatus}, got ${res.status}`);
                failed++;
                return;
            }

            if (bodyAssertion && data) {
                try {
                    bodyAssertion(data);
                    console.log(`✅ PASS: Body assertions matched!`);
                } catch (err) {
                    console.log(`❌ FAIL: Body assertions failed: ${err.message}`);
                    failed++;
                    return;
                }
            }

            console.log(`✅ PASS`);
            passed++;
        } catch (err) {
            console.log(`❌ FAIL: Request failed with error: ${err.message}`);
            failed++;
        }
    };

    console.log("Starting test suite...");

    // 1. GET /tasks - Verify initial tasks
    await assertRes("Get All Tasks (Initial)", "/tasks", { method: "GET" }, 200, (data) => {
        if (!Array.isArray(data)) throw new Error("Expected array of tasks");
        if (data.length !== 2) throw new Error(`Expected 2 tasks, got ${data.length}`);
    });

    // 2. POST /tasks - Create a task (Valid)
    await assertRes("Create Task (Valid)", "/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Write Maturity Report", completed: false })
    }, 201, (data) => {
        if (data.id !== 3) throw new Error(`Expected new task ID to be 3, got ${data.id}`);
        if (data.title !== "Write Maturity Report") throw new Error("Title mismatch");
        if (data.completed !== false) throw new Error("Completed status mismatch");
    });

    // 3. POST /tasks - Missing Content-Type Header
    await assertRes("Create Task (Missing Content-Type Header)", "/tasks", {
        method: "POST"
    }, 400, (data) => {
        if (!data.error.includes("Content-Type header is missing")) throw new Error("Incorrect error message");
    });

    // 4. POST /tasks - Invalid Content-Type Header Format
    await assertRes("Create Task (Invalid Content-Type Header)", "/tasks", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ title: "Plain Text Task" })
    }, 415, (data) => {
        if (!data.error.includes("Content-Type must be application/json")) throw new Error("Incorrect error message");
    });

    // 5. POST /tasks - Validation Failure (Empty Title)
    await assertRes("Create Task (Empty Title Validation)", "/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "  ", completed: false })
    }, 400, (data) => {
        if (!data.error.includes("Task title is required")) throw new Error("Incorrect error message");
    });

    // 6. GET /tasks/:id - Fetch Single Task (Valid)
    await assertRes("Get Task by Valid ID", "/tasks/3", { method: "GET" }, 200, (data) => {
        if (data.id !== 3) throw new Error("ID mismatch");
        if (data.title !== "Write Maturity Report") throw new Error("Title mismatch");
    });

    // 7. GET /tasks/:id - Invalid ID Format (ID Validator Middleware)
    await assertRes("Get Task with Invalid ID Format", "/tasks/abc", { method: "GET" }, 400, (data) => {
        if (!data.error.includes("Task ID must be a positive integer")) throw new Error("Incorrect error message");
    });

    // 8. GET /tasks/:id - Non-existent ID
    await assertRes("Get Task with Non-existent ID", "/tasks/99", { method: "GET" }, 404, (data) => {
        if (!data.error.includes("not found")) throw new Error("Incorrect error message");
    });

    // 9. PUT /tasks/:id - Update Task (Valid)
    await assertRes("Update Task (Valid)", "/tasks/3", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Finish Maturity Report", completed: true })
    }, 200, (data) => {
        if (data.title !== "Finish Maturity Report") throw new Error("Title update failed");
        if (data.completed !== true) throw new Error("Completed status update failed");
    });

    // 10. DELETE /tasks/:id - Delete Task (Valid)
    await assertRes("Delete Task", "/tasks/3", { method: "DELETE" }, 200, (data) => {
        if (!data.message.includes("deleted successfully")) throw new Error("Success message missing");
        if (data.task.id !== 3) throw new Error("Deleted task ID mismatch");
    });

    // 11. GET /tasks/:id - Verify Deletion (404)
    await assertRes("Verify Task Deleted (GET 404)", "/tasks/3", { method: "GET" }, 404);

    // 12. GET /non-existent-route - Undefined Route (404 Handler)
    await assertRes("Undefined Route", "/some/random/route", { method: "GET" }, 404, (data) => {
        if (!data.error.includes("Route not found")) throw new Error("Incorrect 404 format");
    });

    // 13. GET /trigger-error - Trigger Internal Server Error (Global Handler)
    await assertRes("Trigger Error (Global Error Handler)", "/trigger-error", { method: "GET" }, 500, (data) => {
        if (data.error !== "Something went wrong") throw new Error("Raw stack trace was leaked or message was incorrect!");
    });

    console.log(`\n============================`);
    console.log(`Test Execution Finished!`);
    console.log(`Passed: ${passed}/${passed + failed}`);
    console.log(`Failed: ${failed}/${passed + failed}`);
    console.log(`============================`);

    serverProcess.kill('SIGTERM');
    await sleep(500); // Give server a brief moment to shut down gracefully
    if (failed > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

// Start the Express server as a subprocess
const serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
    stdio: 'pipe',
    env: { ...process.env, PORT }
});

// Capture server output
serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    // Print server output to console prefixed for clarity
    process.stdout.write(`[SERVER] ${output}`);
    
    // If the server output signals it has run successfully, execute tests
    if (output.includes(`Server running on port ${PORT}`)) {
        runTests();
    }
});

serverProcess.stderr.on('data', (data) => {
    process.stderr.write(`[SERVER ERROR] ${data.toString()}`);
});

serverProcess.on('close', (code) => {
    console.log(`Server stopped with code ${code}`);
});

// Fallback timeout to terminate tests if something hangs
setTimeout(() => {
    console.error("Test timeout reached. Force stopping server...");
    serverProcess.kill();
    process.exit(1);
}, 30000);
