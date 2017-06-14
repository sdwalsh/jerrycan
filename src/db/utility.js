const {extend, sql, _raw, parseUrl} = require('pg-extra')
const pg = extend(require('pg'))

const config = require('../config')
const pool = new pg.Pool(parseUrl(config.DATABASE_URL))

module.exports = {pool}