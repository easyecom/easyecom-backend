exports.up = knex => {
    return knex.schema.createTable('categories', table => {
        table
            .increments('categoryId')
            .unsigned()
            .primary()
            .unique();

        table.string('categoryName').notNullable();
        table.string('description');
        table.boolean('isActive').defaultTo(true);
        table.string('externalRefId');
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
    await knex.schema.dropTable('categories');
};
