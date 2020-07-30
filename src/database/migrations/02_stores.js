exports.up = knex => {
    return knex.schema.createTable('stores', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('name').notNullable();
        table.string('cnpj').notNullable().unique();
        table.string('email').notNullable()
        table.string('businessPhone')
        table.string('cellPhone')        

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
    knex.schema.dropTable('stores');
};
