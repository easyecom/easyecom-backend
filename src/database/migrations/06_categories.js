exports.up = knex => {
    return knex.schema.createTable('categories', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('name').notNullable();
        table.string('description')
        table.boolean('isActive').defaultTo(true);

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('id')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('categories');
};
