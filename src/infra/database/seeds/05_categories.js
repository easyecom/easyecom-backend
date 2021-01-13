exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('categories')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('categories').insert([
                {
                    categoryId: 1,
                    categoryName: 'calcados',
                    description: 'just be',
                    store_id: 1,
                },
                {
                    categoryId: 2,
                    categoryName: 'camisetas',
                    description: 'just be',
                    store_id: 1,
                },
                {
                    categoryId: 3,
                    categoryName: 'bermudas',
                    description: 'just be',
                    store_id: 2,
                },
                {
                    categoryId: 4,
                    categoryName: 'sapatos',
                    description: 'just be',
                    store_id: 2,
                },
            ]);
        });
};
