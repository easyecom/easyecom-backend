exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('stores')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('stores').insert([
                {
                    id: 1,
                    name: 'enjoydecor',
                    cnpj: '75.242.673/0001-57',
                    email: 'contato@enjoydecor.com',
                    cellPhone: '73 75684-7089',
                },
                {
                  id: 2,
                  name: 'pingo de neve',
                  cnpj: '54.087.398/0001-74',
                  email: 'contato@pingodeneve.com',
                  cellPhone: '56 84063-7572',
              }
            ]);
        });
};
