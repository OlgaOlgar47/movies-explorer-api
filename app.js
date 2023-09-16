const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const {
  DATABASE_URL, DATABASE_DEV, NODE_ENV, PORT
} = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
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

const routes = require('./routes/index');

app.use(routes);

app.use('*', auth, () => {
  throw new NotFoundError(ERR_PAGE_NOT_FOUND);
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
