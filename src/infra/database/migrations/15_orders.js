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

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.decimal('total');

        table.specificType('status', 'jsonb[]');

        table.specificType('cart', 'jsonb[]');

        table.boolean('cancel').defaultTo(false);
        table.boolean('is_completed').defaultTo(false);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('orders');
};
