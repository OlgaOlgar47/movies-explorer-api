const ERR_MOVIE_NOT_FOUND = 'Фильм не найден';
const ERR_FORBIDDEN_DELETE = 'Нельзя удалять фильмы других пользователей';
const ERR_USER_NOT_FOUND = 'Пользователь не найден';
const ERR_PAGE_NOT_FOUND = 'Страница не найдена';
const ERR_CONFLICT_EMAIL = 'Такой email уже зарегистрирован';
const ERR_UNAUTHORIZED = 'Необходима авторизация';
const ERR_UNAUTHORIZED_INPUT = 'Неверное имя пользователя или пароль';
const ERR_URL_INPUT = 'Некорректно введена ссылка';
const ERR_EMAIL_INPUT = 'Некорректно введен email';
const ERR_MIN_INPUT = 'Введите минимум 2 символа';
const ERR_MAX_INPUT = 'Вы ввели больше 30 символов';
const ERR_SERVER = 'Сервер сейчас упадёт';
const STATUS_BAD_REQUEST = 400;
const STATUS_UNAUTHORIZED = 401;
const STATUS_FORBITTEN = 403;
const STATUS_NOT_FOUND = 404;
const STATUS_CONFLICT = 409;
const STATUS_INTERNAL_SERVER_ERROR = 500;
const DEFAULT_ERROR_MESSAGE = 'На сервере произошла ошибка';

module.exports = {
  ERR_MOVIE_NOT_FOUND,
  ERR_FORBIDDEN_DELETE,
  ERR_USER_NOT_FOUND,
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED,
  ERR_UNAUTHORIZED_INPUT,
  ERR_URL_INPUT,
  ERR_EMAIL_INPUT,
  ERR_MIN_INPUT,
  ERR_MAX_INPUT,
  ERR_SERVER,
  ERR_CONFLICT_EMAIL,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBITTEN,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
};
