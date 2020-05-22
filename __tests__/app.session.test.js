import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import faker from 'faker';
import User from '../server/entity/User';
import encrypt from '../server/lib/secure.js';

import app from '../server';

const user = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

describe('Testing session for registered user', () => {
  let server;

  beforeAll(async () => {
    expect.extend(matchers);
    server = app();
    await server.ready();
  });

  beforeEach(async () => {
    await server.ready();
  });

  // afterEach(async () => {

  // });

  it('user should be registered', async () => {
    await request.agent(server.server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ user })
      .catch((err) => {
        console.log(err);
      });

    const userFromDb = await User.findOne({ where: { email: user.email } });

    expect(userFromDb.email).toEqual(user.email);
    expect(userFromDb.passwordDigest).toEqual(encrypt(user.password));
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite'));
  });

});