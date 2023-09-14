const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');

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
        sameSite: true,
      }); // httpOnly кука с токеном
      res.status(200).json({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  // удалится JWT из куков пользователя
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    sameSite: true,
  });

  res.status(200).json({ message: 'Logout successful' });
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
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
        return next(new ConflictError('Такой email уже зарегистрирован'));
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
      throw new NotFoundError('User not found');
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        return next(new BadRequestError(e.message));
      } if (e.code === 11000) {
        return next(new ConflictError('Такой email уже зарегистрирован'));
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
