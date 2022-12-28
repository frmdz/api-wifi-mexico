
const knex = require('knex');

/**
 * Sets up the the configuration for the knex module.
 * Currently it uses env variables, and it should not be used
 * for databases that contain sentitive information.
 *
 * TODO: Implement https://cloud.google.com/secret-manager
 */
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
  },
});

module.exports = db;
