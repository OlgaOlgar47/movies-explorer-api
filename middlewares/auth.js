const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const ERR_UNAUTHORIZED = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const token = req.cookies.jwt; // Получаем токен из куки
  if (!token) {
    throw new UnauthorizedError(ERR_UNAUTHORIZED.ERR_UNAUTHORIZED);
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return next(new UnauthorizedError(ERR_UNAUTHORIZED));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};

module.exports = auth;
