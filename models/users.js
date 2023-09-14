const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const {
  ERR_UNAUTHORIZED_INPUT, ERR_EMAIL_INPUT, ERR_MIN_INPUT, ERR_MAX_INPUT
} = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: ERR_EMAIL_INPUT,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      write_only: true,
    },
    name: {
      type: String,
      required: true,
      minlength: [2, ERR_MIN_INPUT],
      maxlength: [30, ERR_MAX_INPUT]
    },
  },
  { toJSON: { useProjection: true }, toObject: { useProjection: true } }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(ERR_UNAUTHORIZED_INPUT)
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(ERR_UNAUTHORIZED_INPUT)
          );
        }
        return user; // теперь user доступен
      });
    });
};

module.exports = mongoose.model('User', userSchema);
