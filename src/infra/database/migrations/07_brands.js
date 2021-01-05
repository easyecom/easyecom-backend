exports.up = knex => {
    return knex.schema.createTable('brands', table => {
        table
            .increments('brandId')
            .unsigned()
            .primary()
            .unique();

        table.string('brandName').notNullable();
        table.string('description');
        table.boolean('isActive').defaultTo(true);
        table.string('refId');
        table.specificType('products', 'jsonb[]');

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
    await knex.schema.dropTable('brands');
};
