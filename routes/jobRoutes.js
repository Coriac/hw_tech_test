const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/fetch', jobController.fetchAndStoreJobs);

module.exports = router;
