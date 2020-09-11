exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('brands')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('brands').insert([
                {
                    id: 1,
                    brand: 'nike',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 1,
                },
                {
                    id: 2,
                    brand: 'adidas',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 1,
                },
                {
                    id: 3,
                    brand: 'morena rosa',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 2,
                },
                {
                    id: 4,
                    brand: 'bad girls',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 2,
                },
            ]);
        });
};
