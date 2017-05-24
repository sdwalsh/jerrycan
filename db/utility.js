const {extend, parseUrl} = require('pg-extra')
const pg = extend(require('pg'))

const config = require('../src/config')
const pool = new pg.Pool(parseUrl(config.DATABASE_URL))

module.exports = {pool}