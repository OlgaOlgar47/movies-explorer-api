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
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/),
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
