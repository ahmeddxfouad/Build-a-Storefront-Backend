'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.createTable(
        'users',
        {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            first_name: { type: 'string', length: 100, notNull: true },
            last_name: { type: 'string', length: 100, notNull: true },
            password_digest: { type: 'string', notNull: true }
        },
        callback
    );
};

exports.down = function (db, callback) {
    db.dropTable('users', callback);
};

exports._meta = {
    version: 1
};
