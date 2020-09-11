exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('products')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('products').insert([
                {
                    id: 1,
                    name: 'bermuda nike',
                    isActive: true,
                    keyWords:
                        "calcados, sapatos, tenis, skate, camiseta, 'relogios'",
                    title: 'muito legal',
                    descriptionShort: 'muito legal',
                    description: 'muito legal',
                    sku: 1,
                    costPrice: '80.00',
                    offerPrice: null,
                    salesPrice: '120.00',
                    brand_id: 1,
                    store_id: 1,
                },
                {
                    id: 2,
                    name: 'calça adidas',
                    isActive: true,
                    keyWords:
                        "calcados, sapatos, tenis, skate, camiseta, 'relogios'",
                    title: 'muito legal',
                    descriptionShort: 'muito legal',
                    description: 'muito legal',
                    sku: 1,
                    costPrice: '80.00',
                    offerPrice: null,
                    salesPrice: '120.00',
                    brand_id: 2,
                    store_id: 1,
                },
                {
                    id: 3,
                    name: 'bolsa morena rosa',
                    isActive: true,
                    keyWords:
                        "calcados, sapatos, tenis, skate, camiseta, 'relogios'",
                    title: 'muito legal',
                    descriptionShort: 'muito legal',
                    description: 'muito legal',
                    sku: 1,
                    costPrice: '80.00',
                    offerPrice: null,
                    salesPrice: '120.00',
                    brand_id: 3,
                    store_id: 2,
                },
                {
                    id: 4,
                    name: 'blusa bad girls',
                    isActive: true,
                    keyWords:
                        "calcados, sapatos, tenis, skate, camiseta, 'relogios'",
                    title: 'muito legal',
                    descriptionShort: 'muito legal',
                    description: 'muito legal',
                    sku: 1,
                    costPrice: '80.00',
                    offerPrice: null,
                    salesPrice: '120.00',
                    brand_id: 4,
                    store_id: 2,
                },
            ]);
        });
};
