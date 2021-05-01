exports.up = knex => {
    return knex.schema.createTable('modelProducts', table => {
        table
            .increments('modelProductId')
            .unsigned()
            .primary()
            .unique();

        table.string('model').notNullable();
        table.string('typeModel').notNullable();
        table.string('descriptionModelProduct');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('modelProducts');
};