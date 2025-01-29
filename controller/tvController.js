const asyncHandler = require('express-async-handler');
const fetchFromTMDB = require('../services/tmdb.service');  // Ensure this file exists

const getTrendyTv = asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");

    if (!data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No trending TV shows found.' });
    }

    const randomTvShow = data.results[Math.floor(Math.random() * data.results.length)];

    res.status(200).json({
        content: randomTvShow
    });
});

const getTvDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);

    if (!data) {
        return res.status(404).json({ message: 'No details found for this TV show.' });
    }

    res.status(200).json({ success: true, content: data });

});

const getTvTrailers = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);

    if (!data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No trailers found for this TV show.' });
    }

    res.json({ success: true, trailers: data.results });

});

const getSimilarTv = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);

    if (!data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No similar TV shows found for this show.' });
    }

    res.status(200).json({ success: true, similar: data.results });

});

const getTvsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);

    if (!data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No TV shows found in this category.' });
    }

    res.status(200).json(data.results);
});

module.exports = { getTrendyTv, getTvDetails, getTvTrailers, getSimilarTv, getTvsByCategory };
