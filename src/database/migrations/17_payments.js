exports.up = knex => {
    return knex.schema.createTable('payments', table => {
        table
            .increments('paymentId')
            .unsigned()
            .primary()
            .unique();

        table.decimal('value').notNullable();
        table.string('paymentForm').notNullable();
        table.integer('installment').defaultTo(1);
        table.string('status').notNullable();
        table.string('codeGateway');

        table.specificType('cards', 'jsonb[]');

        table.integer('address_id');
        table
            .foreign('address_id')
            .references('addressId')
            .inTable('addresses')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('order_id'); // one order can have more of the one payment type
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

        table.boolean('deliveryAddressEqualBilling').defaultTo(true);

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('payments');
};
