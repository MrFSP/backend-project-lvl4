import request from 'supertest';
import matchers from 'jest-supertest-matchers';

import app from '../server';

describe('Testing responses for Guest', () => {
  let server;

  beforeAll(async () => {
    expect.extend(matchers);
    server = app();
  });

  beforeEach(async () => {
    await server.ready();
  });

  it('should return 200', async () => {
    const res1 = await request.agent(server.server)
      .get('/');
    expect(res1).toHaveHTTPStatus(200);

    const res2 = await request.agent(server.server)
      .get('/session/new');
    expect(res2).toHaveHTTPStatus(200);

    const res3 = await request.agent(server.server)
      .get('/users/new');

    expect(res3).toHaveHTTPStatus(200);
  });

  it('should return 404', async () => {
    const res = await request.agent(server.server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(404);
  });

  afterAll(async () => {
    await server.close();
  });

});
