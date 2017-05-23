const {extend, parseUrl} = require('pg-extra')
const pg = extend(require('pg'))

const config = require('../src/config')

// =========================================================

// This is the connection pool the rest of our db namespace
// should import and use
const pool = new pg.Pool(parseUrl(config.DATABASE_URL))

module.exports = {pool}