const express = require('express');
const { getTrendyTv, getTvTrailers, getTvDetails, getSimilarTv, getTvsByCategory } = require('../controller/tvController');

const router = express.Router();

router.route('/trending').get(getTrendyTv)
router.route('/:id/trailers').get(getTvTrailers)
router.route('/:id/details').get(getTvDetails)
router.route('/:id/similar').get(getSimilarTv)
router.route('/:category').get(getTvsByCategory);

module.exports = router;