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

const changedUser = {
  email: `changed${user.email}`,
  password: `changed${user.password}`,
  firstName: `changed${user.firstName}`,
  lastName: `changed${user.lastName}`,
};

const getCookie = async (server) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

const pathToFixtures = path.join(__dirname, '__fixtures__');

let logoutPagetml;

describe('Testing session for registered user', () => {
  let server;

  beforeAll(async () => {
    logoutPagetml = await fs.readFile(path.join(pathToFixtures, 'logout-page.html'));

    expect.extend(matchers);
    server = app();
    await server.ready();
  });

  beforeEach(async () => {
    await server.ready();
  });

  // afterEach(async () => {

  // });

  it('User should be registered', async () => {
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

  it('Should get new session', async () => {
    const res = await request.agent(server.server)
      .post('/session')
      .send({ object: user })
      .redirects(2)
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should return current session', async () => {
    const res = await request.agent(server.server)
      .get('/users/user')
      .set('cookie', await getCookie(server))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page "create new task"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/new')
      .set('cookie', await getCookie(server))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page "task settings"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/settings')
      .set('cookie', await getCookie(server))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page for changing password', async () => {
    const res = await request.agent(server.server)
      .get('/users/password')
      .set('cookie', await getCookie(server))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get changed password', async () => {
    await request.agent(server.server)
      .post('/users/password/index')
      .set('cookie', await getCookie(server))
      .send({
        object: {
          oldPass: user.password,
          newPass: changedUser.password,
          confirmNewPass: changedUser.password,
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const userFromDb = await User.findOne({ where: { email: user.email } });

    expect(userFromDb.passwordDigest).toEqual(encrypt(changedUser.password));
  });

  it('Should delete current session', async () => {
    const res = await request.agent(server.server)
      .delete('/session')
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(logoutPagetml.toString());
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite'));
  });

});