const express = require('express');
const { searchResumes } = require('../controllers/searchController');
const router = express.Router();

router.post('/search', searchResumes);

module.exports = router;//Port 
port = 6000;

