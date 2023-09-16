const Movie = require('../models/movies');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const { ERR_MOVIE_NOT_FOUND, ERR_FORBIDDEN_DELETE } = require('../utils/constants');

const getMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId }, { __v: 0 })
    .then((movies) => {
      res.json(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN
  })
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
        throw new NotFoundError(ERR_MOVIE_NOT_FOUND);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(ERR_FORBIDDEN_DELETE);
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
