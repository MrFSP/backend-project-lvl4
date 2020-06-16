// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root' }, (req, reply) => {
      const userId = req.session.get('userId');
      if (!userId) {
        return reply.render('welcome/index');
      }
      reply.redirect(app.reverse('tasks#index'));
    });
};
