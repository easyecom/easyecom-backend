import connection from '../../../database/connection';

class adminClientController {
    async getClientsByStore(req, res) {
        const { store_id } = req.params;
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
                .where({ 'stores.id': store_id });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOneClientByStore(req, res) {
        const { store_id } = req.params;
        const { client_id } = req.headers;

        try {
            const data = await connection('users')
                .join('stores', 'stores.id', 'users.store_id')
                .join('addresses', 'users.id', 'addresses.user_id')
                .join('clients', 'users.id', 'clients.user_id')

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
                    'users.permission'
                )
                .where({
                    'stores.id': store_id,
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

    async updateOneClientByStore(req, res) {
        const { client_id } = req.params;
        const clients = req.body;

        try {
            const data = await connection('clients')
                .where({ id: client_id })
                .update(clients, ['dateOfBirth', 'cpf']);

            return res.status(200).json(data);
        } catch (err) {
            return console.error({ stack: err.stack });
        }
    }

    async deleteOneClientByStore(req, res) {
        const { client_id } = req.params;

        try {
            let deleted = true;

            const data = await connection('clients')
                .where('id', client_id)
                .update({ deleted }, 'deleted');

            if (!data) {
                return res.status(404).json({ message: 'user does not exist' });
            }

            return res.status(202).json({ deletado: true });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new adminClientController();
