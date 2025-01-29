const express = require('express');
const { searchPerson, searchMovie, searchTv, searchHistory, removeHistory } = require('../controller/searchController');

const router = express.Router();

router.route('/person/:query').get(searchPerson);
router.route('/movie/:query').get(searchMovie);
router.route('/tv/:query').get(searchTv);
router.route('/history').get(searchHistory);
router.route('/history/:id').delete(removeHistory);

module.exports = router;
 