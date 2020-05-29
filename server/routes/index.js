// @ts-check

import welcome from './welcome';
import users from './users';
import session from './session';
import tasks from './tasks';

const controllers = [
  welcome,
  users,
  session,
  tasks
];

export default (app) => controllers.forEach((f) => f(app));
