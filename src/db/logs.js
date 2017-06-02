const {pool} = require('./utility')
const {sql} = require('pg-extra')

exports.findLog = async function (uuid) {
    const string = knex('logs')
        .where({uuid: uuid})
        .returning('*')
        .toString();
    return pool.one(_raw`${string}`);
}

exports.createLog = async function (user, car, miles, gallons, price, date, receipt, location) {
    // assert miles is integer
    // assert gallons is double
    // assert price is money
    // assert date is timestamp
    // assert receipt is a valid url
    // assert location is a string

    return pool.one(sql`
    INSERT INTO logs (user_uuid, car_uuid, type, miles, gallons, price, total, receipt, location, notes)
    VALUES (SELECT uuid FROM users WHERE uuid = ${user}), 
    (SELECT uuid FROM cars WHERE uuid = ${car}), 
    ${miles}, ${gallons}, ${price}, ${total}, ${date}, 
    ${receipt}, ${location}, ${notes})
    RETURNING uuid
    `);
}

exports.deleteLog = async function (uuid) {
    const string = knex('logs')
        .where({uuid: uuid})
        .delete()
        .toString();
    return pool.one(_raw`${string}`);
}