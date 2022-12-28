const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const controllers = require('../controllers/access-points.js');

/*
Returns a paginated list of access points.
It can be filterd by 'colonia' if specified.

Usage: /access-points?page=1&colonia=COLONIA
*/
router.get('/', controllers.getAccessPoints);

/*
Returns a paginated list of the closest access points for a given pair
of coordinates.

Usage: /access-points/closest?latitud=LAT&longitud=LONG&page=4
*/
router.get('/closest', controllers.getClosestAccessPoints);

/*
Returns a list of access points matching an ID. As on the original dataset
the IDs are not unique, this can return more than one; however, the number
of access points returned is limited to 100 (in practice, we should not
expect more than 10 access points with the same ID).

Usage: /access-points/ID
*/
router.get('/:id', controllers.getAccessPointById);

module.exports = router;
