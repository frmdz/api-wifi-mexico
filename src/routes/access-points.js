const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => {
  res.send('This will give you a list of APs.');
});

router.get('/closest', (req, res) => {
  res.send('This will give you the closest AP based on two co-ordinates');
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(`This will give you the information for the AP with the ID '${id}'`);
});

module.exports = router;
