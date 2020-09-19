exports.up = knex => {
    return knex.schema.createTable('orders', table => {
        table
            .increments('orderId')
            .unsigned()
            .primary()
            .unique();

        table.integer('client_id');
        table
            .foreign('client_id')
            .references('clientId')
            .inTable('clients')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.specificType('shoppingCart', 'jsonb[]');

        table.integer('delivery_id');
        table
            .foreign('delivery_id')
            .references('deliveryId')
            .inTable('deliveries')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.boolean('cancel').defaultTo(false);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('orders');
};
