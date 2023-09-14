const { celebrate, Joi } = require('celebrate');

// Схема валидации для пользователя
const userSchema = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  email: Joi.string().email().required().min(2)
    .max(30),
});

const userIdParamSchema = Joi.object().keys({
  userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});

const validateUser = celebrate({
  body: userSchema,
});

const validateUserIdParam = celebrate({
  params: userIdParamSchema,
});

// Схема валидации для фильмов
const movieSchema = Joi.object().keys({
  country: Joi.string().required().min(2).max(30),
  director: Joi.string().required().min(2).max(30),
  duration: Joi.number().required(),
  year: Joi.string().required().min(2).max(30),
  description: Joi.string().required().min(2).max(100),
  image: Joi.string().required()
    .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/),
  trailerLink: Joi.string().required()
    .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/),
  thumbnail: Joi.string().required()
    .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required().min(2).max(30)
    .pattern(/^[А-Яа-яЁё]+$/),
  nameEN: Joi.string().required().min(2).max(30)
    .pattern(/^[A-Za-z]+$/)
});

const movieIdParamSchema = Joi.object().keys({
  movieId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});

const validateMovie = celebrate({
  body: movieSchema,
});

const validateMovieIdParam = celebrate({
  params: movieIdParamSchema,
});

module.exports = {
  validateUser,
  validateUserIdParam,
  validateMovie,
  validateMovieIdParam,
};
