exports.up = knex => {
    return knex.schema.createTable('prices', table => {
        table
            .integer('variation_id')
            .primary()
            .unique();
            
        table
            .foreign('variation_id')
            .references('variationId')
            .inTable('variations')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.decimal('costPrice');

        table.integer('profitMargin');
        table.decimal('offerPrice');
        table.decimal('salesPrice').notNullable();

        table.specificType('promotion', 'jsonb[]');

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
    await knex.schema.dropTable('prices');
};
