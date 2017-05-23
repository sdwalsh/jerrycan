const assert = require('better-assert');
const uuid = require('uuid');
const knex = require('knex')({ client: 'pg' });
const {sql, _raw} = require('pg-extra');
const debug = require('debug')('app:db:index');

const {pool} = require('./util');

// SQL query functions.  When this becomes busy factor out into seperate files and export

// Create user with a GoogleID
// Don't store the auth tokens in the users table
exports.createUser = async function (gid, name, email) {
    // assert gid is valid
    // assert name is valid
    // assert email is valid
    return pool.one(sql`
    INSERT INTO users (gid, name, email)
    VALUES (${gid}, ${name}, ${email})
    RETURNING *
    `)
}