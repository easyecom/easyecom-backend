exports.up = knex => {
    return knex.schema.createTable('clients', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('dateOfBirth').notNullable();
        table.string('cpf').notNullable();
        table.boolean('deleted').defaultTo(false);

        table.integer('user_id')
        table
            .foreign('user_id')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('clients');
};
