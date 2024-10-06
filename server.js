const express = require('express');
const app = express();
const db = require('./db'); // Ensure that your 'db' file is correctly setting up your database connection
require('dotenv').config();

// Corrected here
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import the routes file
const userRoutes = require('./Routes/userRoutes');
const candidateRoutes = require('./Routes/candidateRoutes');

// Use the router
app.use('/user', userRoutes);
app.use('/candidate',candidateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Listening on port 3000');
});
