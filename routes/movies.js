const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateMovie,
  validateMovieIdParam,
} = require('../validation/validation');

const movieRouter = express.Router();

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateMovie, createMovie);
movieRouter.delete('/movies/:movieId', validateMovieIdParam, deleteMovie);

module.exports = movieRouter;
