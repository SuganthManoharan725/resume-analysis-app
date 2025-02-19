const express = require('express');
const { enrichResumeData } = require('../controllers/resumeController');
const router = express.Router();

router.post('/enrich', enrichResumeData);

module.exports = router;
