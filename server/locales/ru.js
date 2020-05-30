module.exports = {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
          noAuthorisation: 'Вы ещё не прошли авторизацию',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
          emailExists: 'Пользователь с данным емейлом уже зарегистрирован',
          wrongOldPass: 'Неверно введён старый пароль',
          wrongConfirmation: 'Пароли не совпадают',
          passwordChanged: 'Пароль успешно изменён',
        },
      },
      tasks: {
        empty: 'Введите имя статуса или тега',
        error: 'Непредвиденная ошибка',
        info: {
          empty: 'Введите название задачи',
        },
        status: {
          exists: 'Статус с таким именем уже существует',
          empty: 'Введите имя статуса',
          added: 'Статус добавлен',
        },
        tag: {
          exists: 'Тег с таким именем уже существует',
          empty: 'Введите имя тега',
          added: 'Тег добавлен',
        },
      }
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
      },
      tasks: {
        change: {
          title: 'Изменить задачу',
          taskName: 'Название задачи',
          status: 'Статус',
          assignedto: 'Ответственный',
          save: 'Сохранить',
        },
        new: {
          title: 'Новая задача',
          description: 'Введите описание задачи',
          create: 'Создать задачу',
        },
        settings: {
          newTag: {
            name: 'Теги',
            add: 'Добавить тег',
          },
          newTaskStatus: {
            name: 'Статусы',
            add: 'Добавить статус',
          },
          add: 'Добавить',
          back: 'Вернуться',
          settings: 'Настройки',
          tags: 'Теги',
        },
        tasks: {
          title: 'Список задач',
          myTasks: 'Мои задачи',
          filters: 'Фильтры',
          assignedTo: 'Кому',
          tag: 'Тег',
          apply: 'Применить',
          change: 'Изменить',
          delete: 'Удалить',
          author: 'Автор',
        },
      },
      user: {
        delete: {
          delete: 'Удалить',
          deleteMessage: 'Вы действительно хотите удалит свой аккаунт? Восстановить его будет невозможно',
          deleteTitle: 'Удалить профиль?',
          save: 'Нет, оставить',
          confirmDelete: 'Да, удалить',
          accountDeleted: 'Ваш аккаунт успешно удалён',
        },
        password: {
          chPassTitle: 'Изменение пароля',
          chPass: 'Изменить пароль',
          back: 'Вернуться',
          confirmChange: 'Сохранить',
          passChanged: 'Ваш пароль изменён',
          oldPass: 'Старый пароль',
          newPass: 'Новый пароль',
          confirmNewPass: 'Подтвердите новый пароль',
        },
        email: 'email',
        firstName: 'Имя',
        lastName: 'Фамилия',
        accountUpdated: 'Ваш аккаунт обновлён',
        update: 'Обновить',
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
