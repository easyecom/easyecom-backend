exports.up = knex => {
    return knex.schema.createTable('variations', table => {
        table
            .increments('variationId')
            .unsigned()
            .primary()
            .unique();

        table.string('variationName').notNullable();
        table.boolean('isActive').defaultTo(true);
        table.boolean('IsVisible').defaultTo(false);
        table.boolean('soldOut').defaultTo(false);
        table.string('keyWords');
        table.string('title');
        table.string('descriptionShort');
        table.string('description');
        table.string('ean');

        table.string('packagedHeight').notNullable();
        table.string('packagedLength').notNullable();
        table.string('packagedWidth').notNullable();
        table.string('weightKg');
        table.string('CubicWeight');

        table.specificType('images', 'jsonb[]');

        table.boolean('freeShipping').defaultTo(false);

        table.string('amount').notNullable();

        table.decimal('costPrice').notNullable();
        table.decimal('offerPrice').notNullable();
        table.decimal('salesPrice').notNullable();
        table.string('refId');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('product_id');
        table
            .foreign('product_id')
            .references('productId')
            .inTable('products')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('variations');
};
