const request = require('supertest');

let app;

beforeAll(() => {
  // eslint-disable-next-line global-require
  app = require('../tests/testServer');
});

test('POST /api/doctor/auth/login validates input', async () => {
  const res = await request(app).post('/api/doctor/auth/login').send({ email: 'not-an-email', password: '' });
  expect(res.status).toBe(400);
  expect(res.body.success).toBe(false);
});
