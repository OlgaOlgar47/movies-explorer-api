const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { DATABASE_URL, NODE_ENV } = process.env;// DATABASE_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb'
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { PORT, DATABASE_DEV } = require('./config');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();
const NotFoundError = require('./utils/errors/NotFoundError');
const { ERR_SERVER, ERR_PAGE_NOT_FOUND } = require('./utils/constants');

// Проверяем значение NODE_ENV и устанавливаем соответствующий URL для подключения к базе данных
const dbURL = NODE_ENV === 'production' ? DATABASE_URL : DATABASE_DEV;

mongoose.connect(dbURL);

// Проверка состояния подключения
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных:'));
db.once('open', () => {
  console.log('Подключение к базе данных установлено.');

  if (db.readyState === 1) {
    console.log('База данных подключена.');
  } else {
    console.log('База данных не подключена.');
  }
});

const app = express();
app.use(
  cors({
    origin: 'https://api.movies-explorerolga.nomoreparties.co',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(limiter);
app.use(helmet());

app.use(cookieParser());

app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ERR_SERVER);
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);

const routes = require('./routes/index');

app.use(auth, routes);

app.use('*', auth, () => {
  throw new NotFoundError(ERR_PAGE_NOT_FOUND);
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
