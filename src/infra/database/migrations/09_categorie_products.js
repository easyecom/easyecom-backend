exports.up = knex => {
    return knex.schema.createTable('category_products', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.integer('category_id');
        table
            .foreign('category_id')
            .references('categoryId')
            .inTable('categories')
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
    await knex.schema.dropTable('category_products');
};
