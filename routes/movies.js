const express = require('express');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateMovie,
} = require('../validation/validation');

const movieRouter = express.Router();

movieRouter.get('/movies', getMovies);
movieRouter.post('/movies', validateMovie, createMovie);
movieRouter.delete('/movies/:movieId', deleteMovie);

module.exports = movieRouter;
