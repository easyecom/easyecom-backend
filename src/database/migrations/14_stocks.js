exports.up = knex => {
    return knex.schema.createTable('stocks', table => {
        table
            .integer('variation_id')
            .unsigned()
            .primary()
            .unique();
        table
            .foreign('variation_id')
            .references('variationId')
            .inTable('variations')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('quantity').notNullable();

        table.boolean('quantityLimit').defaultTo(false);
        table.integer('minimumAmount');
        table.integer('maximumAmount');

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

exports.down = knex => {
    knex.schema.dropTable('stocks');
};
