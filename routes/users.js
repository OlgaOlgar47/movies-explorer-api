const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUser,
  logout,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users/me', getUserMe);
userRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);
userRouter.post('/signout', logout);

module.exports = userRouter;