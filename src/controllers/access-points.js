const model = require('../models/access-points.js');

/**
 *
 * @param {string} latitud
 * @param {string} longitud
 * @return {bool}
 * regex to check if the input are valid coordinates. see [1]
 * [1] {@link https://stackoverflow.com/questions/11475146/javascript-regex-to-validate-gps-coordinates}
 */
const coordinatesAreValid = (latitud, longitud) =>
  /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/.test(latitud) &&
  /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/.test(longitud);

/**
 *
 * @param {string} pageNumber
 * @return {bool}
 *
 * regex to check if the page number is a non zero positive number. See [1]
 * [1] {@link https://stackoverflow.com/questions/7036324/what-is-the-regex-for-any-positive-integer-excluding-0}
 */
const pageNumberIsValid = (pageNumber) => /^[1-9]\d*$/.test(pageNumber);

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 *
 * Controller for getAccessPointById,
 * validates the input before sending it to the  the model.
 */
async function getAccessPointById(req, res) {
  // get the required ID
  const id = req.params.id;

  try {
    const queryResults = await model.getAccessPointsId(id);
    res.send(queryResults);
  } catch (error) {
    // catch errors that are thrown if the parameters are invalid.
    res.status(400).send('Bad Request' + error);
  }
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 *
 * Controller for getAccessPoints
 * validates the input before sending it to the  the model.
 */
async function getAccessPoints(req, res) {
  // get the required query parameters
  const colonia = req.query.colonia;

  // if is not given (undefined) it will be set to 1.
  const page = req.query.page || '1';

  try {
    if (!pageNumberIsValid(page)) {
      throw new Error('The page number is not valid.');
    }
    const queryResults = await model.getAccessPoints(colonia, page);
    res.send(queryResults);
  } catch (error) {
    // catch errors that are thrown if the parameters are invalid.
    res.status(400).send('Bad Request' + error);
  }
}

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 *
 * Controller for getClosestAccessPoints
 * validates the input before sending it to the  the model.
 */
async function getClosestAccessPoints(req, res) {
  // get the required query parameters
  const {latitud, longitud} = req.query;

  // if is not given (undefined) it will be set to 1.
  const page = req.query.page || '1';

  try {
    if (!coordinatesAreValid(latitud, longitud)) {
      throw new Error('Coordinates are not valid.');
    }
    if (!pageNumberIsValid(page)) {
      throw new Error('The page number is not valid.');
    }

    // eslint-disable-next-line max-len
    const queryResults = await model.getClosestAccessPoints(latitud, longitud, page);
    res.send(queryResults);
  } catch (error) {
    // catch errors that are thrown if the parameters are invalid.
    res.status(400).send('Bad Request' + error);
  }
}

module.exports = {
  getAccessPoints,
  getClosestAccessPoints,
  getAccessPointById,
};
