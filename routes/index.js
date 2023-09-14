const express = require('express');
const movieRouter = require('./movies'); // Подключаем роуты из movies.js
const userRouter = require('./users'); // Подключаем роуты из users.js

const router = express.Router();

router.use(movieRouter);
router.use(userRouter);

module.exports = router;
