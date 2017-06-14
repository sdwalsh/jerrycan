const assert = require('better-assert');
const uuid = require('uuid');
const knex = require('knex')({client: 'pg'});
const {sql, _raw} = require('pg-extra');
const debug = require('debug')('app:db:index');

const {pool} = require('./utility');

exports.createCar = async function(user, type, model, year) {
    return pool.one(sql`
    INSERT INTO cars (user_uuid, type, model, year)
    VALUES ((SELECT uuid FROM users WHERE uuid = ${user}), ${type}, 
    ${model}, ${year})
    RETURNING uuid
    `);
};

exports.updateCar = async function(uuid, type, model, year) {
    const string = knex('cars')
        .where({uuid: uuid})
        .update({
            type: type,
            model: model,
            year: year,
        })
        .toString();
    return pool.one(_raw`${string}`);
};

exports.findCarsByUser = async function(user) {
    const string = knex('cars')
        .where({user_uuid: user})
        .returning('*')
        .toString();
    return pool.many(_raw`${string}`);
};

exports.findCar = async function(uuid) {
    const string = knex('cars')
        .where({uuid: uuid})
        .returning('*')
        .toString();
    return pool.one(_raw`${string}`);
};

exports.deleteCar = async function(uuid) {
    const string = knex('cars')
        .where({uuid: uuid})
        .del()
        .toString();
    return pool.one(_raw`${string}`);
};
