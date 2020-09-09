exports.up = knex => {
    return knex.schema.createTable('payments', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.decimal('value', 6, 2).notNullable();
        table.string('formOfPay').notNullable();
        table.integer('installment').defaultTo(1);
        table.string('status').notNullable();
        table.string('codeGateway')

        table.integer('address_id');
        table
            .foreign('address_id')
            .references('id')
            .inTable('addresses')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('card_id');
        table
            .foreign('card_id')
            .references('id')
            .inTable('cards')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('order_id');
        table
            .foreign('order_id')
            .references('id')
            .inTable('orders')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('id')
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
