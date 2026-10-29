/*
  task.test.js
  Automated Integration & Unit Tests for CI/CD Pipeline
  Author: Parth Patoliya | Practical 12: CI/CD Pipeline with GitHub Actions
*/

const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const jwt = require('jsonwebtoken');

describe('Task Management API — CI/CD Test Suite', () => {
    let authToken;

    beforeAll(() => {
        // Generate a mock JWT for authenticated requests (fallback_secret used in test environment)
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        authToken = jwt.sign({ id: '60d5ec48fcf24b2f28b45a60' }, secret, { expiresIn: '1h' });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // Test 1: GET /tasks endpoint returns 200 with authenticated user
    test('GET /tasks returns 200', async () => {
        // Mock Task.find to return a sample task list without requiring a live MongoDB connection in CI
        jest.spyOn(Task, 'find').mockResolvedValue([
            {
                _id: '60d5ec48fcf24b2f28b45a60',
                title: 'CI Pipeline Sample Task',
                description: 'Automated test execution in GitHub Actions',
                completed: false,
                priority: 'high',
                user: '60d5ec48fcf24b2f28b45a60'
            }
        ]);

        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${authToken}`);

        // Step 6: Restored correct assertion to ensure passing pipeline
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('CI Pipeline Sample Task');
    });

    // Test 2: GET /tasks returns 401 Unauthorized when no authentication token is provided
    test('GET /tasks returns 401 when no token is provided', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    // Test 3: GET /non-existent-route returns 404 Route Not Found
    test('GET /non-existent-route returns 404', async () => {
        const res = await request(app).get('/api/invalid-endpoint-path');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    // Test 4: GET /trigger-error returns 500 Internal Server Error (Error middleware)
    test('GET /trigger-error returns 500', async () => {
        const res = await request(app).get('/trigger-error');
        expect(res.statusCode).toBe(500);
    });

    // Test 5: POST /api/ai/generate-description returns 200 with fallback/AI description (Practical 13)
    test('POST /api/ai/generate-description returns 200 with description', async () => {
        const res = await request(app)
            .post('/api/ai/generate-description')
            .send({ title: 'Prepare Docker deployment documentation' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('description');
        expect(typeof res.body.description).toBe('string');
        expect(res.body.description.length).toBeGreaterThan(0);
    });

    // Test 6: POST /api/ai/generate-description returns 400 when title is missing
    test('POST /api/ai/generate-description returns 400 when title is missing', async () => {
        const res = await request(app)
            .post('/api/ai/generate-description')
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
