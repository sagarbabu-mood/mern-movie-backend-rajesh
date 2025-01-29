const axios = require('axios');

const fetchFromTMDB = async (url) => {
    try {
        const response = await axios.get(url, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`, // Ensure API Key is correct
            },
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error(
                `Failed to fetch from TMDB: ${error.response.statusText} (status: ${error.response.status})`
            );
            throw new Error(
                `Failed to fetch data from TMDB: ${error.response.statusText}`
            );
        } else {
            console.error('Error in fetchFromTMDB:', error.message);
            throw new Error('An error occurred while fetching data from TMDB.');
        }
    }
};

module.exports = fetchFromTMDB;
