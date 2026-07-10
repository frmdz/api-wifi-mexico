const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const controllers = require('../controllers/health-check.js');

/*
Healthcehck
*/
router.get('/', controllers.healthcheck);

module.exports = router;
