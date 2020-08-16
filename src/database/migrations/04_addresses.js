exports.up = knex => {
    return knex.schema.createTable('addresses', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('zipcode').notNullable();
        table.string('street').notNullable();
        table.string('number').notNullable();
        table.string('complement');
        table.string('neighborhood').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
        table.string('state_code');
        table.string('country');

        table.integer('store_id');
        table
            .foreign('store_id')
            .references('id')
            .inTable('stores')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.integer('user_id');
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
    knex.schema.dropTable('addresses');
};
