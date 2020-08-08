import connection from '../../../database/connection';

class adminClienteController {
    async getClientsByStore(req, res) {
        const { id } = req.params;
        const { page = 1 } = req.query;

        try {
            const data = await connection('users')
                .join('stores', 'stores.id', 'users.store_id')
                .limit(20)
                .offset((page - 1) * 20)
                .select(
                    'users.id',
                    'users.name',
                    'users.email',
                    'store_id',
                    'avatar_id',
                    'users.permission'
                )
                .where({ 'stores.id': id });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOneClientByStore(req, res) {
        const { id } = req.params;
        const { page = 1 } = req.query;
        const { client_id } = req.headers;

        try {
            const data = await connection('users')
                .join('stores', 'stores.id', 'users.store_id')
                .join('addresses', 'users.id', 'addresses.user_id')
                .join('clients', 'users.id', 'clients.user_id')

                .limit(20)
                .offset((page - 1) * 20)

                .select(
                    'users.id',
                    'users.name',
                    'users.email',

                    'clients.cpf',
                    'dateOfBirth',

                    'addresses.street',
                    'addresses.number',
                    'addresses.complement',
                    'addresses.neighborhood',
                    'addresses.city',
                    'addresses.state',
                    'addresses.zipcode',

                    'users.store_id',
                    'users.avatar_id',
                    'users.permission',
                )
                .where({
                    'stores.id': id,
                    'users.id': client_id,
                    'addresses.user_id': client_id,
                    'clients.user_id': client_id,
                });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new adminClienteController();
