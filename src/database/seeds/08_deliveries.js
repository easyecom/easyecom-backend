exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('deliveries')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('deliveries').insert([
                {
                    id: 1,
                    status: 'objeto em transito',
                    tracking: '24568767',
                    type: 'pac',
                    cost: 12.0,
                    deliveryTime: '3d',
                    address_id: 1,
                    store_id: 1,
                },
                {
                    id: 2,
                    status: 'objeto em transito',
                    tracking: '24568767',
                    type: 'pac',
                    cost: 12.0,
                    deliveryTime: '3d',
                    address_id: 2,
                    store_id: 1,
                },
                {
                    id: 3,
                    status: 'objeto em transito',
                    tracking: '24568767',
                    type: 'pac',
                    cost: 12.0,
                    deliveryTime: '3d',
                    address_id: 3,
                    store_id: 2,
                },
                {
                    id: 4,
                    status: 'objeto em transito',
                    tracking: '24568767',
                    type: 'pac',
                    cost: 12.0,
                    deliveryTime: '3d',
                    address_id: 4,
                    store_id: 2,
                },
            ]);
        });
};