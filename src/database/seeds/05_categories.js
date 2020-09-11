exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('categories')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('categories').insert([
                {
                    id: 1,
                    category: 'calcados',
                    description: 'just be',
                    store_id: 1,
                },
                {
                    id: 2,
                    category: 'camisetas',
                    description: 'just be',
                    store_id: 1,
                },
                {
                    id: 3,
                    category: 'bermudas',
                    description: 'just be',
                    store_id: 2,
                },
                {
                    id: 4,
                    category: 'sapatos',
                    description: 'just be',
                    store_id: 2,
                },
            ]);
        });
};
