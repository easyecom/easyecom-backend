exports.up = knex => {
    return knex.schema.createTable('stocks', table => {
        table
            .increments('stockId')
            .unsigned()
            .primary()
            .unique();

        table.integer('amountSku').notNullable();
        table.boolean('unlimitedAmount');
        table.integer('minimumAmount').notNullable();
        table.integer('maximumAmount').notNullable();

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('variation_id');
        table
            .foreign('variation_id')
            .references('variationId')
            .inTable('variations')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('stocks');
};
