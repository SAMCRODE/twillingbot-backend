const config = require('../config/database');
const {Pool} = require('pg');

const pool = new Pool({
  connectionString: config.conn,
  max: 10,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
