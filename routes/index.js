const express = require('express');
const movieRouter = require('./movies'); // Подключаем роуты из movies.js
const userRouter = require('./users'); // Подключаем роуты из users.js
const { validateSignin, validateSignup, } = require('../validation/validation');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

const router = express.Router();

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, createUser);
router.use(auth, movieRouter);
router.use(auth, userRouter);

module.exports = router;
