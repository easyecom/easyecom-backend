exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('users')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                {
                    userId: 1,
                    userName: 'thiago',
                    email: 'thiago@gmail.com',
                    password: 12345,
                    store_id: 1,
                    permission: ['client', 'admin'],
                },
                {
                    userId: 2,
                    userName: 'dariane',
                    email: 'dariane@gmail.com',
                    password: 12345,
                    store_id: 2,
                    permission: ['client', 'admin'],
                },
                {
                    id: 3,
                    name: 'malaquias',
                    email: 'malaquias@gmail.com',
                    password: 12345,
                    store_id: 1,
                    permission: ['client'],
                },
                {
                    id: 4,
                    name: 'andevaldo',
                    email: 'andevaldo@gmail.com',
                    password: 12345,
                    store_id: 1,
                    permission: ['client'],
                },
                {
                    id: 5,
                    name: 'eliabe',
                    email: 'eliabe@gmail.com',
                    password: 12345,
                    store_id: 1,
                    permission: ['client'],
                },
                {
                    id: 6,
                    name: 'josefina',
                    email: 'josefina@gmail.com',
                    password: 12345,
                    store_id: 2,
                    permission: ['client'],
                },
                {
                    id: 7,
                    name: 'carmelita',
                    email: 'carmelita@gmail.com',
                    password: 12345,
                    store_id: 2,
                    permission: ['client'],
                },
                {
                    id: 8,
                    name: 'jarede',
                    email: 'jarede@gmail.com',
                    password: 12345,
                    store_id: 2,
                    permission: ['client'],
                },
            ]);
        });
};
