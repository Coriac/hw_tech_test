const express = require('express');
const router = express.Router();
const {
  fetchAndStoreJobs,
  jobsStats,
} = require('../controllers/jobController');

router.get('/fetch', fetchAndStoreJobs);
router.get('/stats', jobsStats);

module.exports = router;
