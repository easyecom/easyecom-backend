exports.up = knex => {
    return knex.schema.createTable('carts', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('staticalProduct');
        table.string('amount').defaultTo(1);

        table.json('itemsObj').defaultTo({});

        table.specificType('itemsArray', 'jsonb[]');

        table.integer('product_id');
        table
            .foreign('product_id')
            .references('id')
            .inTable('products')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('variation_id');
        table
            .foreign('variation_id')
            .references('id')
            .inTable('variations')
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

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('carts');
};
