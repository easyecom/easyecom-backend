exports.up = knex => {
    return knex.schema.createTable('colors', table => {
        table
            .increments('colorId')
            .unsigned()
            .primary()
            .unique();

        table.string('colorName').notNullable();
        table.string('hexadecimal').notNullable();
        table.string('description');

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = async knex => {
    await knex.schema.dropTable('colors');
};

