'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('entry', {
    id: { type: 'int', primaryKey: true },
    gid: 'string',
    miles: 'numeric',
    gallons: 'numeric',
    price: 'money',
    date: 'timestamp',
    receipt: 'string',
    location: 'string'
  });

  db.addForeignKey('entry', 'users', 'uid', 
  {
    'uid': 'id'
  },
  {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT'
  });
  return db;
};

exports.down = function(db) {
  db.removeForeignKey('entry', 'gid', 
  {
    dropIndex: true,
  });
  db.dropTable('entry');
  return db;
};

exports._meta = {
  "version": 1
};
