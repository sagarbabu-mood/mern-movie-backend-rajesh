const express = require('express');
const {getTrendyMovie, getMovieTrailer, getMovieDetails, getSimilarMovies, getMoviesByCategory} = require('../controller/movieController');
const router = express.Router();

router.route('/trending').get(getTrendyMovie)
router.route('/:id/trailers').get(getMovieTrailer)
router.route('/:id/details').get(getMovieDetails)
router.route('/:id/similar').get(getSimilarMovies)
router.route('/:category').get(getMoviesByCategory);

module.exports = router; 