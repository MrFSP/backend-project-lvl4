import { filterTasks } from '../server/routes/tasks';
import faker from 'faker';

const task1 = {
  name: faker.lorem.word(),
  status: faker.lorem.word(),
};
const task2 = {
  name: faker.lorem.word(),
  assignedTo: faker.random.number,
};

const task3 = {
  name: faker.lorem.word(),
  tags: [{ id: faker.random.number } ]
};

const tasks = [task1, task2, task3];

describe('Testing filter function', () => {

  it('Should get all tasks', async () => {
    const filteredTasks = filterTasks(tasks);

    expect(filteredTasks).toBe(tasks);
  });

  it('Should get task1', async () => {
    const filteredTasks = filterTasks(tasks, { taskStatus: task1.status });

    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0]).toBe(task1);
  });

  it('Should get task2', async () => {
    const filteredTasks = filterTasks(tasks, { assignedTo: task2.assignedTo });

    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0]).toBe(task2);
  });

  it('Should get task3', async () => {
    const filteredTasks = filterTasks(tasks, { tag: task3.tags[0].id });

    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0]).toBe(task3);
  });
});