// @ts-check

import welcome from './welcome';
import users from './users';
import session from './session';
import tasks from './tasks';
import taskstatuses from './taskstatuses';

const controllers = [
  welcome,
  users,
  session,
  tasks,
  taskstatuses
];

export default (app) => controllers.forEach((f) => f(app));
