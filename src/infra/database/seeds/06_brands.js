exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('brands')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('brands').insert([
                {
                    brandId: 1,
                    brandName: 'nike',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 1,
                },
                {
                    brandId: 2,
                    brandName: 'adidas',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 1,
                },
                {
                    brandId: 3,
                    brandName: 'morena rosa',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 2,
                },
                {
                    brandId: 4,
                    brandName: 'bad girls',
                    isActive: true,
                    description: 'lindinhos',
                    store_id: 2,
                },
            ]);
        });
};
