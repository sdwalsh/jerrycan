exports.up = function(knex, Promise) {
  return knex.schema.createTable('cars', function(table) {
        table.uuid("uuid").defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.uuid("user_uuid");
        table.foreign('user_uuid').references('users.uuid').onDelete('CASCADE');
        table.text('type');
        table.text('model');
        table.integer('year');
    });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('cars');  
};
