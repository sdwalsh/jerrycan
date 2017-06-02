const assert = require('better-assert');
const uuid = require('uuid');
const knex = require('knex')({ client: 'pg' });
const {sql, _raw} = require('pg-extra');
const debug = require('debug')('app:db:index');

const {pool} = require('./utility');

// Export sub modules
exports.cars = require('./cars');
exports.logs = require('./logs');

// SQL query functions.  When this becomes busy factor out into seperate files and export

// Create user with a GoogleID
// Don't store the auth tokens in the users table
exports.createUser = async function (gid, name, email) {
    // assert gid is valid
    // assert name is valid
    // assert email is valid
    const string = knex('users')
        .insert({gid: gid}, {name: name}, {email: email})
        .returning('uuid')
        .toString();
    return pool.one(_raw`${string}`);
}

exports.findUserG = async function (gid) {
    // assert gid is valid
    const string = knex('users')
        .where({gid: gid})
        .returning('*')
        .toString();
    return pool.one(_raw`${string}`);
}

exports.findUserU = async function (uuid) {
    const string = knex('users')
        .where({uuid: uuid})
        .returning('*')
        .toString();
    return pool.one(_raw`${string}`);
}