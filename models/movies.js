const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/.test(v);
      },
      message: 'Некорректно введена ссылка',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/.test(v);
      },
      message: 'Некорректно введена ссылка',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?#?$/.test(v);
      },
      message: 'Некорректно введена ссылка',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('Movie', movieSchema);