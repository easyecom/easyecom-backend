exports.up = knex => {
    return knex.schema.createTable('sizes', table => {
        table
            .increments('sizeId')
            .unsigned()
            .primary()
            .unique();

        table.string('size').notNullable();
        table.string('description');
        table.string('createdBy');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('sizes');
};
