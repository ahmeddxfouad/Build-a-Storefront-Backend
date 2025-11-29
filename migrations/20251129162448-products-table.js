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
        'products',
        {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            name: { type: 'string', length: 255, notNull: true },
            price: { type: 'decimal', notNull: true },
            category: { type: 'string', length: 255 }
        },
        callback
    );
};

exports.down = function (db, callback) {
    db.dropTable('products', callback);
};

exports._meta = {
    version: 1
};
