const asyncHandler = require('express-async-handler');
const fetchFromTMDB = require('../services/tmdb.service');

const getTrendyMovie = asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");

    if (!data || !data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No trending movie found.' });
    }

    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

    res.status(200).json({ content: randomMovie });
});

const getMovieTrailer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);

    if (!data || !data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No trailers found for this movie.' });
    }

    res.json({ success: true, trailers: data.results });

});

const getMovieDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);

    if (!data) {
        return res.status(404).json({ message: 'No details found for this movie.' });
    }

    res.status(200).json({ success: true, content: data });

});

const getSimilarMovies = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);

    if (!data || !data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No similar movies found for this movie.' });
    }

    res.status(200).json({ success: true, similar: data.results });

});

const getMoviesByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;

    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);

    if (!data || !data.results || data.results.length === 0) {
        return res.status(404).json({ message: 'No movies found in this category.' });
    }

    res.status(200).json({ content: data.results });
});

module.exports = {
    getTrendyMovie,
    getMovieTrailer,
    getMovieDetails,
    getSimilarMovies,
    getMoviesByCategory,
};
