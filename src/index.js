
const express = require('express');
const api = express();

const accessPoints = require('./routes/access-points.js');
const healthcheck = require('./routes/health-check.js');

// Use the routes for the access points defined in /src/routes/access-points.js
api.use('/access-points', accessPoints);
api.use('/health', healthcheck);

module.exports = api;
