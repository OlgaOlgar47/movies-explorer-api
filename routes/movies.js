const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const movieRouter = express.Router();

movieRouter.get('/movies', getMovies);
movieRouter.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
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
    }),
  }),
  createMovie
);
movieRouter.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
    }),
  }),
  deleteMovie
);

module.exports = movieRouter;
