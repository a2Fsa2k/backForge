const request = require('supertest');

let app;

beforeAll(() => {
  // server.js does not export app; we load the express instance from a lightweight test server.
  // This keeps changes minimal without refactoring existing server startup.
  // eslint-disable-next-line global-require
  app = require('../tests/testServer');
});

test('GET /api/health returns ok', async () => {
  const res = await request(app).get('/api/health');
  expect(res.status).toBe(200);
  expect(res.body.success).toBe(true);
});
