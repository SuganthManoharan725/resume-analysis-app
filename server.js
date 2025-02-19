const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require ("mongoose");
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use(express.json());

// //api routes
app.use('/api', authRoutes);
app.use('/api', resumeRoutes);
app.use('/api', searchRoutes);

const MONGO_URI = process.env.MONGO_URI; // Get the MongoDB URI from environment variables

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('MONGO_URI environment variable not set. Please define it in your .env file.');
  process.exit(1); // Exit the process with an error code
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const Port = process.env.LOCALHOST_URI;

app.listen(Port, ()=>{
    console.log (`server running on ${Port || '3000'}`)
})