exports.up = function(knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .then(function () {
        knex.schema.createTable('users', function(table) {
            table.uuid("uuid").defaultTo(knex.raw('uuid_generate_v4')).primary();
            table.foreign('user_uuid').references('Users.uuid').onDelete('CASCADE');
            table.text('type');
            table.text('model');
            table.integer('year');
        });
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('cars');  
};
