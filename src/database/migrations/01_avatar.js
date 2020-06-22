exports.up = knex => {
    return knex.schema.createTable('avatar', table => {
        table
            .increments('id')
            .unsigned()
            .primary();
        table.string('name').notNullable();
        table.string('path').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('avatar');
};
