const asyncHandler = require('express-async-handler');
const fetchFromTMDB = require('../services/tmdb.service');
const User = require('../models/userModel');

    const searchPerson = asyncHandler(async (req, res) => {
        const { query } = req.params;
    
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
    
        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({ message: `No person found with the query "${query}".` });
        }
    
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
    
        const isDuplicate = user.searchHistory.some((item) => item.id === data.results[0].id);
    
        if (!isDuplicate) {
            user.searchHistory.push({
                id: data.results[0].id,
                image: data.results[0].profile_path || data.results[0].poster_path,
                title: data.results[0].name || 'Unknown',
                searchType: 'person',
                createdAt: new Date(),
            });
        }
    
        await user.save();
        res.status(200).json({ content: data.results });
    });
    
    const searchMovie = asyncHandler(async (req, res) => {
        const { query } = req.params;
    
        const data = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
        );
    
        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({ message: `No movies found with the name "${query}".` });
        }
    
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
    
        const isDuplicate = user.searchHistory.some((item) => item.id === data.results[0].id);
    
        if (!isDuplicate) {
            user.searchHistory.push({
                id: data.results[0].id,
                image: data.results[0].poster_path || data.results[0].profile_path,
                title: data.results[0].title || 'Unknown',
                searchType: 'movie',
                createdAt: new Date(),
            });
        }
    
        await user.save();
    
        res.status(200).json({ content: data.results });
    });
    
    const searchTv = asyncHandler(async (req, res) => {
        const { query } = req.params;
    
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);
    
        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({ message: `No TV shows found with the name "${query}".` });
        }
    
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
    
        const isDuplicate = user.searchHistory.some((item) => item.id === data.results[0].id);
    
        if (!isDuplicate) {
            user.searchHistory.push({
                id: data.results[0].id,
                image: data.results[0].profile_path || data.results[0].poster_path,
                title: data.results[0].name || 'Unknown',
                searchType: 'tv',
                createdAt: new Date(),
            });
        }
    
        await user.save();
        res.status(200).json({ content: data.results });
    });
    

const searchHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({content:user.searchHistory});
});

const removeHistory = asyncHandler(async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID provided.' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const historyItem = user.searchHistory.find(item => item.id === id);
    if (!historyItem) {
        return res.status(400).json({ message: `History item with ID ${id} does not exist.` });
    }

    await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { searchHistory: { id: id } } },
        { new: true }
    );

    res.status(200).json({ message: `History item with ID ${id} was removed successfully.` });
});

module.exports = {
    searchPerson,
    searchMovie,
    searchTv,
    searchHistory,
    removeHistory,
};
