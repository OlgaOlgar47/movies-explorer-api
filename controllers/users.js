const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = require('../config');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const { ERR_USER_NOT_FOUND, ERR_CONFLICT_EMAIL } = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        }
      );
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'none',
      }); // httpOnly кука с токеном
      res.status(200).json({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  // удалится JWT из куков пользователя
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
  });
  res.status(200).json({ message: 'Logout successful' });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERR_USER_NOT_FOUND);
      }
      res.status(200).json(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name, } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).json({ user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return next(new BadRequestError(e.message));
      } if (e.code === 11000) {
        return next(new ConflictError(ERR_CONFLICT_EMAIL));
      }
      return next(e);
    });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new NotFoundError(ERR_USER_NOT_FOUND);
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return next(new BadRequestError(e.message));
      } if (e.code === 11000) {
        return next(new ConflictError(ERR_CONFLICT_EMAIL));
      }
      return next(e);
    });
};

module.exports = {
  login,
  logout,
  getUserMe,
  createUser,
  updateUser,
};
