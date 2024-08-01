const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const getMovies = async (req, res) => {
  const page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit);
  limit = limit ? limit : 30;
  const skip = page == 1 ? 0 : page * limit - limit;
  const totalMovies=await Movie.find({});

  const movies = await Movie.find({}).skip(skip).limit(limit);
  const obj={
    movies,total:totalMovies.length,page,limit
  }
  res.json(obj);
};

const createMovie = async (req, res) => {
  const { title, publishingYear } = req.body;
  const poster = req.file ? req.file.filename : null;

  const movie = new Movie({ title, publishingYear, poster });

  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { title, publishingYear } = req.body;
  const poster = req.file ? req.file.filename : null;

  const movie = await Movie.findById(id);

  if (movie) {
    movie.title = title;
    movie.publishingYear = publishingYear;
    if (poster) movie.poster = poster;

    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
};

module.exports = { getMovies, createMovie, updateMovie, upload };
