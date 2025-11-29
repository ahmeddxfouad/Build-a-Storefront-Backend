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
        'order_products',
        {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            order_id: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: 'order_products_order_id_fk',
                    table: 'orders',
                    mapping: 'id',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                }
            },
            product_id: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: 'order_products_product_id_fk',
                    table: 'products',
                    mapping: 'id',
                    rules: {
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                }
            },
            quantity: { type: 'int', notNull: true }
        },
        callback
    );
};

exports.down = function (db, callback) {
    db.dropTable('order_products', callback);
};

exports._meta = {
    version: 1
};
