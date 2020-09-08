exports.up = knex => {
    return knex.schema.createTable('cards', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('fullName').notNullable();
        table.string('areaCode').notNullable();
        table.string('phoneNumber').notNullable();
        table.string('dateOfBirth').notNullable();
        table.string('credit_card_token').notNullable();
        table.string('cpf').notNullable();

        table.integer('order_id');
        table
            .foreign('order_id')
            .references('id')
            .inTable('orders')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

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
    knex.schema.dropTable('cards');
};
