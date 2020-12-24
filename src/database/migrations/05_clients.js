exports.up = knex => {
    return knex.schema.createTable('clients', table => {
        table
            .increments('clientId')
            .unsigned()
            .primary()
            .unique();

        table.string('dateOfBirth').notNullable();
        table.string('cpf').notNullable();
        table.boolean('deleted').defaultTo(false);

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('storeId')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('user_id');
        table
            .foreign('user_id')
            .references('userId')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('clients');
};
