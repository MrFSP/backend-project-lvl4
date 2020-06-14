import i18next from 'i18next';
import TaskStatus from '../entity/TaskStatus.js';
import defaultStatuses from '../configs/statuses.config';

export default (app) => {
  app
    .get('/taskstatuses', { name: 'taskstatuses#index' }, async (req, reply) => {
      const allTaskStatuses = await app.orm.getRepository(TaskStatus).find();
      const couldNotBeDeletedStatuses = [...defaultStatuses];
      const defaultTaskStatuses = allTaskStatuses
        .filter((status) => couldNotBeDeletedStatuses.includes(status.name));
      const taskStatuses = allTaskStatuses
        .filter((status) => !couldNotBeDeletedStatuses.includes(status.name));
      return reply.render(
          'tasks/settings/index',
          {
            taskStatuses,
            defaultTaskStatuses,
          },
        );
    })
    .post(
      '/taskstatuses',
      { name: 'taskstatuses#create' },
      async (req, reply) => {
        const { newTaskStatus } = req.body;

        const isExists = await app.orm
          .getRepository(TaskStatus)
          .findOne({ name: newTaskStatus.name })
          ? true
          : false;

        if (isExists) {
          req.flash('error', i18next.t(`flash.tasks.status.exists`));
        } else if (!newTaskStatus.name) {
          req.flash('error', i18next.t(`flash.tasks.status.empty`));
        } else if (!isExists) {
          req.flash('info', i18next.t(`flash.tasks.status.added`));
          await TaskStatus.create(newTaskStatus).save();
        }

        return reply.redirect(app.reverse('taskstatuses#index'));
      }
    )
    .delete(
      '/taskstatuses/:id',
      { name: 'taskstatuses#destroy' },
      async (req, reply) => {
        const taskStatusId = req.params.id;
        await app.orm
          .getRepository(TaskStatus)
          .remove({ id: taskStatusId });
        req.flash(
          'info',
          i18next.t(`views.tasks.settings.newTaskStatus.success`)
        );

        return reply.redirect(app.reverse('taskstatuses#index'));
      }
    );
};