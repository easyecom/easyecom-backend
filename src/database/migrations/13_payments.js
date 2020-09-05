exports.up = knex => {
    return knex.schema.createTable('users', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.decimal('value',  6, 2).notNullable();
        table.string('formOfPay').notNullable();  
        table.integer('installment').defaultTo(1);
        table.string('status').notNullable();  

        table.integer('address_id');
        table
            .foreign('address_id')
            .references('id')
            .inTable('addresses')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

        table.specificType('card', 'array[]');

        table.integer('card_id');
        table
            .foreign('card_id')
            .references('id')
            .inTable('card')
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
    knex.schema.dropTable('users');
};
