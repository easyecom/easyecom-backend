exports.up = knex => {
    return knex.schema.createTable('products', table => {
        table
            .increments('productId')
            .unsigned()
            .primary()
            .unique();

        table.string('productName').notNullable();
        table.boolean('isActive').defaultTo(true);
        table.boolean('IsVisible').defaultTo(false);
        table.boolean('soldOut').defaultTo(false);
        table.boolean('highlight').defaultTo(false);
        table.string('keyWords');
        table.string('title');
        table.string('descriptionShort').notNullable();
        table.string('description');
        table.integer('sku')
        table.specificType('variations', 'jsonb[]');
        table.specificType('images', 'jsonb[]');
        table.specificType('evaluations', 'jsonb[]');
        table.integer('mainCategory');
        table.string('refId');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('brand_id');
        table
            .foreign('brand_id')
            .references('brandId')
            .inTable('brands')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('products');
};
