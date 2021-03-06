exports.up = knex => {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
        .createTable('stores', table => {
            table
                .increments('storeId')
                .unsigned()
                .primary()
                .unique();

            table
                .string('api_key')
                .defaultTo(knex.raw('uuid_generate_v4()'))
                .unique();

            table.string('storeName').notNullable();
            table
                .string('cnpj')
                .notNullable()
                .unique();

            table.string('email').notNullable();
            table.string('businessPhone');
            table.string('cellPhone');

            table.string('zipcode');
            table.string('street');
            table.string('number');
            table.string('complement');
            table.string('neighborhood');
            table.string('city');
            table.string('state');
            table.string('state_code');
            table.string('country');

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
};

exports.down = async knex => {
    await knex.schema.dropTable('stores');
};
