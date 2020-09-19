exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('stores')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('stores').insert([
                {
                    storeId: 1,
                    storeName: 'enjoydecor',
                    cnpj: '75.242.673/0001-57',
                    email: 'contato@enjoydecor.com',
                    cellPhone: '73 75684-7089',
                },
                {
                    storeId: 2,
                    storeName: 'pingo de neve',
                    cnpj: '54.087.398/0001-74',
                    email: 'contato@pingodeneve.com',
                    cellPhone: '56 84063-7572',
                },
            ]);
        });
};
