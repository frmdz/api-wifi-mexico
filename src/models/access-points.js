const db = require('./db.js');

// TODO: add all the env into one module.
const table = process.env.DB_TABLE || 'access_points';

// I might want to use an env for this.
const PAGE_LIMIT = 15;

/**
 * array of orders objects {@link https://knexjs.org/guide/query-builder.html#orderby oderby}
 */
const ORDERS = [
  {column: 'alcaldia', order: 'asc'},
  {column: 'colonia', order: 'asc'},
  {column: 'id', order: 'asc'},
];

/**
 *
 * @param {string} latitud
 * @param {string} longitud
 * @returns {string} the SQL statement to add a column containing
 * the harversine distance:
 * {@link https://en.wikipedia.org/wiki/Haversine_formula}:
 *
 * It uses the earthdistance module to enable the <@> operator:
 * {@link https://www.postgresql.org/docs/14/earthdistance.html}
 *
 * The output is expected to be inside of a knex raw parameter binding:
 * {@link https://knexjs.org/guide/raw.html}
 *
 */
// eslint-disable-next-line max-len
const addDistanceColumn = (latitud, longitud) => `point(longitud, latitud) <@> point(${longitud}, ${latitud}) as distance, *`;

/**
 *
 * @param {string} colonia
 * @param {string} page
 * @return {object} containing a page of results
 */
async function getAccessPoints(colonia, page) {
  return db.select()
      .from(table)
      // if colonia is undefined skips the filter
      .modify((db) => (colonia) ? db.where('colonia', colonia): db)
      .orderBy(ORDERS)
      // page is automatically cast to an integer
      .offset((page - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
};

/**
 *
 * @param {string} id
 * @return {object} containing the access poits that match an ID.
 */
async function getAccessPointsId(id) {
  return db.select()
      .from(table)
      .where('id', id)
      .orderBy(ORDERS)
      .limit(PAGE_LIMIT);
};


/**
 *
 * @param {string} latitud
 * @param {string} longitud
 * @param {string} page
 * @return {object} the closest access points to a coordinate.
 * for more information on how the distance is compute reger to
 * the function @see {addDistanceColumn}.
 */
const getClosestAccessPoints = async (latitud, longitud, page) => {
  return db.select(db.raw(addDistanceColumn(latitud, longitud)))
      .from(table)
      .orderBy([
        {column: 'distance', order: 'asc'},
        ...ORDERS,
      ])
      // page is automatically cast to an integer
      .offset((page - 1) * PAGE_LIMIT)
      .limit(PAGE_LIMIT);
};

module.exports = {
  getAccessPoints,
  getClosestAccessPoints,
  getAccessPointsId,
};
