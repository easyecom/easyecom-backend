exports.up = knex => {
    return knex.schema.createTable('evaluations', table => {
        table
            .increments('evaluationId')
            .unsigned()
            .primary()
            .unique();

        table.string('clientName').notNullable();
        table.string('evaluationText').notNullable();
        table.integer('evaluationScore').defaultTo(0);

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

exports.down = async knex => {
    await knex.schema.dropTable('evaluations');
};
