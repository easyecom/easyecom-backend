exports.up = knex => {
    return knex.schema.createTable('prices', table => {
        table
            .increments('priceId')
            .unsigned()
            .primary()
            .unique();

        table.decimal('costPriceSku');
        table.integer('profitMargin');
        table.decimal('offerPriceSku');
        table.decimal('salesPriceSku').notNullable();
        table.specificType('promotion', 'jsonb[]');

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
    knex.schema.dropTable('prices');
};
