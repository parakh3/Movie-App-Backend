const express = require('express');
const { getMovies, createMovie, updateMovie, upload } = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getMovies).post(protect, upload.single('poster'), createMovie);
router.route('/:id').put(protect, upload.single('poster'), updateMovie);

module.exports = router;

// "C:\Users\ayush\movie-database-backend\uploads"