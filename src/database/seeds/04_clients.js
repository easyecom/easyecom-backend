exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('clients')
        .del()
        .then(function() {
            // Inserts seed entries
            return knex('clients').insert([
                {
                    id: 1,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-21',
                    user_id: 1,
                },
                {
                    id: 2,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-22',
                    user_id: 2,
                },
                {
                    id: 3,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-23',
                    user_id: 3,
                },
                {
                    id: 4,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-24',
                    user_id: 4,
                },
                {
                    id: 5,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-25',
                    user_id: 5,
                },
                {
                    id: 6,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-26',
                    user_id: 6,
                },
                {
                    id: 7,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-27',
                    user_id: 7,
                },
                {
                    id: 8,
                    dateOfBirth: '26-01-1988',
                    cpf: '158-158-158-28',
                    user_id: 8,
                },
            ]);
        });
};
