const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors  = require('cors');

// Routes configuration
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const tvRoutes = require('./routes/movieRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Connect to MongoDB database
const connectDatabase = require('./config/dbConnection');

// Middleware to authenticate token before accessing protected routes
const authenticateToken = require('./middleware/authenticateToken');

dotenv.config();
connectDatabase();

const port = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());

app.use(express.json());

app.use(cors({ credentials: true }));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/movies', authenticateToken, movieRoutes);
app.use('/api/v1/tv', authenticateToken, tvRoutes);
app.use('/api/v1/search', authenticateToken, searchRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


