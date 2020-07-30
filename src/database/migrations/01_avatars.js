exports.up = knex => {
    return knex.schema.createTable('avatars', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();;
            
        table.string('name').notNullable();
        table.string('path').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('avatars');
};
