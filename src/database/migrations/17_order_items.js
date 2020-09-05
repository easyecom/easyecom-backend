exports.up = knex => {
    return knex.schema.createTable('users', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.integer('client_id');
        table
            .foreign('client_id')
            .references('id')
            .inTable('client')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.specificType('card', 'array[]');

        table.integer('payment_id');
        table
            .foreign('payment_id')
            .references('id')
            .inTable('payments')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('delivery_id');
        table
            .foreign('delivery_id')
            .references('id')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('id')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('users');
};
