const config = require('../config/database');
const {Pool} = require('pg');

const pool = new Pool({
  connectionString: config.conn,
  max: 1,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
