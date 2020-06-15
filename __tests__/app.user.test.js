import request from 'supertest';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';

import app from '../server';
import User from '../server/entity/User';
import encrypt from '../server/lib/secure.js';

const currUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const wrongEmailUser = {
  email: faker.lorem.word(),
  password: faker.internet.password(),
};

// const defaultTaskStatus = { name: 'Новый' };

const getCookie = async (server, user) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

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

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});

describe('Testing responses for User', () => {
  let server;

  beforeAll(async () => {

    expect.extend(matchers);
    server = app();
    await server.ready();
  });

  // beforeEach(async () => {

  // });

  it('User should be registered', async () => {
    await request.agent(server.server)
      .post('/users')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    const userFromDb = await User.findOne({ where: { email: currUser.email } });

    expect(userFromDb.email).toEqual(currUser.email);
    expect(userFromDb.passwordDigest).toEqual(encrypt(currUser.password));
  });

  it('User should not be registered', async () => {
    await request.agent(server.server)
      .post('/users')
      .send({ user: wrongEmailUser })
      .catch((err) => {
        console.log(err);
      });

    const userFromDb = await User
      .findOne({ where: { email: wrongEmailUser.email } });

    expect(userFromDb).toBe(undefined);
  });

  it('Should deny registration with exists email', async () => {
    await request.agent(server.server)
      .post('/users')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    const usersFromDb = await User.find();

    expect(usersFromDb.length).toEqual(1);
  });

  it('should return 404', async () => {
    const res = await request.agent(server.server)
      .get('/wrong-path')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    expect(res).toHaveHTTPStatus(404);
  });

  it('Should get new session', async () => {
    const res = await request.agent(server.server)
      .post('/session')
      .send({ object: currUser })
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(302);
  });

  it('Should return page "/users"', async () => {
    const res = await request.agent(server.server)
      .get('/users')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should return page "/users/:id/edit"', async () => {
    const userFromDb = await User.findOne({ where: { email: currUser.email } });
    const res = await request.agent(server.server)
      .get(`/users/${userFromDb.id}/edit`)
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
  });

  it('User should be redirected to "/tasks"', async () => {
    const res = await request.agent(server.server)
      .get('/')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(302);
  });

  it('Should get page "/tasks"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page "/tasks/new"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page for changing password', async () => {
    const userFromDb = await User.findOne({ where: { email: currUser.email } });
    const res = await request.agent(server.server)
      .get(`/users/${userFromDb.id}/password`)
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should delete current session', async () => {
    const res = await request.agent(server.server)
      .delete('/session')
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(302);
  });

  it('Should delete current user', async () => {
    const currUserFromDb = await User.findOne({ where: { email: currUser.email } });
    const isCurrUserExistsBeforeDelQuery = currUserFromDb ? true : false;

    await request.agent(server.server)
      .delete(`/users/${currUserFromDb.id}`)
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    const currUserFromDbAfterQuery = await User.findOne({ where: { email: currUser.email } })
    const isCurrUserExistsAfterQuery = currUserFromDbAfterQuery ? true : false;

    expect(isCurrUserExistsBeforeDelQuery).toBe(true);
    expect(isCurrUserExistsAfterQuery).toBe(false);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});
