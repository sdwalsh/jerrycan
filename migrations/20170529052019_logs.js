exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(function () {
        knex.schema.createTable('users', function(table) {
            table.uuid("uuid").defaultTo(knex.raw('uuid_generate_v4')).primary();
            table.foreign('user_uuid').references('Users.uuid').onDelete('CASCADE');
            table.text('car_uuid').references('Cars.uuid').onDelete('CASCADE');
            table.enu('type', ['GAS', 'MAINTENANCE', 'FAILURE', 'OTHER']).defaultTo('GAS');
            table.integer('miles');
            table.decimal('gallons');
            table.specificType('price', 'MONEY');
            table.specificType('total', 'MONEY');
            table.text('receipt');
            table.text('location');
            table.date('date').defaultTo(knex.raw(current_date));
            table.text('notes');
        });
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('logs');  
};

