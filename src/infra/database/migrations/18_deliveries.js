exports.up = knex => {
    return knex.schema.createTable('deliveries', table => {
        table
            .increments('deliveryId')
            .unsigned()
            .primary()
            .unique();

        table.string('deliveryStatus').notNullable();
        table.string('tracking')
        table.string('type').notNullable();
        table.decimal('cost').notNullable();
        table.string('deadline').notNullable();
        table.string('externalRefId');

        table.integer('address_id');
        table
            .foreign('address_id')
            .references('addressId')
            .inTable('addresses')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('order_id');
        table
            .foreign('order_id')
            .references('orderId')
            .inTable('orders')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('deliveries');
};
