exports.up = knex => {
    return knex.schema.createTable('products', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('name').notNullable();
        table.boolean('isActive').defaultTo(true);
        table.string('keyWords');
        table.string('title');
        table.string('descriptionShort').notNullable();
        table.string('description');
        table.integer('sku')
        table.decimal('costPrice')
        table.decimal('offerPrice')
        table.decimal('salesPrice').notNullable();

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('id')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('brand_id');
        table
            .foreign('brand_id')
            .references('id')
            .inTable('brands')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('products');
};
