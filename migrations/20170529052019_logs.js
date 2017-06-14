exports.up = function(knex, Promise) {
  return knex.schema.createTable('logs', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.uuid('user_uuid');
        table.foreign('user_uuid').references('users.uuid').onDelete('CASCADE');
        table.uuid('car_uuid');
        table.foreign('car_uuid').references('cars.uuid').onDelete('CASCADE');
        table.enu('type', ['GAS', 'MAINTENANCE', 'FAILURE', 'OTHER'])
             .defaultTo('GAS');
        table.integer('miles');
        table.decimal('gallons');
        table.specificType('price', 'MONEY');
        table.specificType('total', 'MONEY');
        table.text('receipt');
        table.text('location');
        table.date('date').defaultTo(knex.raw('current_date'));
        table.text('notes');
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('logs');
};

