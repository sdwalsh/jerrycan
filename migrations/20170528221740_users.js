exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
        table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()')).primary();
        table.string('gid');
        table.text('name');
        table.text('email');
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('users');
};
