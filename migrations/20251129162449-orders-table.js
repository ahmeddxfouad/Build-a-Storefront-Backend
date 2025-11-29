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
        'orders',
        {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            user_id: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: 'orders_user_id_fk',
                    table: 'users',
                    mapping: 'id',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                }
            },
            status: { type: 'string', length: 20, notNull: true }
        },
        callback
    );
};

exports.down = function (db, callback) {
    db.dropTable('orders', callback);
};

exports._meta = {
    version: 1
};
