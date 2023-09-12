const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// eslint-disable-next-line no-undef
const { DATABASE_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb'} = process.env;
const { PORT } = require('./config');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');

mongoose.connect(DATABASE_URL);

// Проверка состояния подключения
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных:'));
db.once('open', () => {
  console.log('Подключение к базе данных установлено.');

  // Проверка состояния подключения
  if (db.readyState === 1) {
    console.log('База данных подключена.');
  } else {
    console.log('База данных не подключена.');
}
});

const app = express();
app.use(
  cors({
    origin: 'http://api.movies-explorerolga.nomoreparties.co',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(cookieParser());

require('dotenv').config();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/movies');
const NotFoundError = require('./utils/errors/NotFoundError');

app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
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

app.use(auth, userRouter);
app.use(auth, cardRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', auth, (req, res) => {
  throw new NotFoundError('Page not found');
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
