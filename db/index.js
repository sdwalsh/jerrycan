const assert = require('better-assert');
const uuid = require('uuid');
const knex = require('knex')({ client: 'pg' });
const {sql, _raw} = require('pg-extra');
const debug = require('debug')('app:db:index');

const {pool} = require('./utility');

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

// Find a user given a google id
exports.findUser = async function (gid) {
    // assert gid is valid
    const string = knex('users')
        .where({gid: gid})
        .returning('*')
        .toString();
    return pool.one(_raw`${string}`)
}

exports.createLog = async function (miles, gallons, price, date, receipt, location) {
    // assert miles is integer
    // assert gallons is double
    // assert price is money
    // assert date is timestamp
    // assert receipt is a valid url
    // assert location is a string

    return pool.one(sql`
    INSERT INTO entry (miles, gallons, price, date, receipt, location)
    VALUES (${miles}, ${gallons}, ${price}, ${date}, ${receipt}, ${location})
    RETURNING *
    `)
}