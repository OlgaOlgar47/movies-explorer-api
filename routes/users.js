const express = require('express');

const {
  getUserMe,
  updateUser,
  logout,
} = require('../controllers/users');
const { validateUser } = require('../validation/validation');

const userRouter = express.Router();

userRouter.get('/users/me', getUserMe);
userRouter.patch('/users/me', validateUser, updateUser);
userRouter.post('/signout', logout);

module.exports = userRouter;
