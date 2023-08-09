/* eslint-disable consistent-return */
const Movie = require('../models/movies');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({}, { __v: 0 })
    .then((movies) => {
      res.json(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const { name, link } = req.body;

  return Movie.create({ name, link, owner: req.user._id })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Movie not found');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Cannot delete movie of other user');
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
