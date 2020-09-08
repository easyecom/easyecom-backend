exports.up = knex => {
    return knex.schema.createTable('deliveries', table => {
        table
            .increments('id')
            .unsigned()
            .primary()
            .unique();

        table.string('status').notNullable();
        table.string('tracking').notNullable();
        table.string('type').notNullable();
        table.decimal('cost').notNullable();
        table.string('deliveryTime').notNullable();

        table.integer('address_id');
        table
            .foreign('address_id')
            .references('id')
            .inTable('addresses')
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
    knex.schema.dropTable('deliveries');
};
