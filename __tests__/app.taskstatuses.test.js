import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import faker from 'faker';
import TaskStatus from '../server/entity/TaskStatus';
import defaultStatuses from '../server/configs/statuses.config';

import app from '../server';

const currUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const newTaskStatus = { name: faker.lorem.word() };

const getCookie = async (server, user) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

describe('Testing task statuses CRUD in app', () => {
  let server;

  beforeAll(async () => {

    expect.extend(matchers);
    server = app();
    await server.ready();

    await request.agent(server.server)
      .post('/users')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: defaultStatuses[0] })
      .catch((err) => {
        console.log(err);
      });
  });

  beforeEach(async () => {
    await server.ready();
  });

  it('Should set new task status', async () => {
    const res = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const status = await TaskStatus
      .findOne({ where: { name: newTaskStatus.name }});

    expect(res).toHaveHTTPStatus(302);
    expect(status.name).toEqual(newTaskStatus.name);
  });

  it("Should not set new task status when task's status name exists", async () => {

    const res = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();

    expect(res).toHaveHTTPStatus(302);
    expect(statuses.length).toBe(1);
  });

  it('Should not set new task status when name is empty', async () => {

    const res = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: { name: '' } })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();

    expect(res).toHaveHTTPStatus(302);
    expect(statuses.length).toBe(1);
  });

  it('Should get page "/taskstatuses"', async () => {
    const res = await request.agent(server.server)
      .get('/taskstatuses/edit')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
    });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should delete task status', async () => {
    const statusBeforeDeleting = await TaskStatus
      .findOne({ where: { name: newTaskStatus.name } });

    expect(statusBeforeDeleting.name).toEqual(newTaskStatus.name);

    await request.agent(server.server)
      .delete(`/taskstatuses/${statusBeforeDeleting.id}`)
      .set('cookie', await getCookie(server, currUser))
      .send({ taskStatusId: statusBeforeDeleting.id })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();
    const status = await TaskStatus
      .findOne({ where: { name: newTaskStatus.name } });
    
    expect(statuses.length).toBe(0);
    expect(status).toBe(undefined);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});