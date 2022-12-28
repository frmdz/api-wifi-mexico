
const express = require('express');
const api = express();

const accessPoints = require('./routes/access-points.js');

// Use the routes for the access points defined in /src/routes/access-points.js
api.use('/access-points', accessPoints);

module.exports = api;
