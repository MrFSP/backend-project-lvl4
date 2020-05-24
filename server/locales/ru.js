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
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    tasks: {
      settings: {
        newTag: 'Добавить тег',
        newTaskStatus: 'Добавить статус',
        add: 'Добавить',
      }
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
