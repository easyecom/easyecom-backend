const connection = require('../../../database/connection');

class adminClientController {
    async getClientsByStore(req, res) {
        const { store_id } = req.params;
        const { page = 1 } = req.query;

        try {
            const data = await connection('clients')
                .join('users', 'users.userId', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .limit(20)
                .offset((page - 1) * 20)
                .select(
                    'clients.clientId',
                    'clients.user_id',
                    'users.store_id',
                    'users.avatar_id',

                    'users.userName',
                    'users.email',
                    'clients.dateOfBirth',
                    'clients.cpf',

                    'addresses.zipcode',
                    'addresses.street',
                    'addresses.number',
                    'addresses.complement',
                    'addresses.neighborhood',
                    'addresses.city',
                    'addresses.state',
                    'addresses.state_code',
                    'addresses.country',

                    'users.permission'
                )
                .where({
                    'users.store_id': store_id,
                    'clients.store_id': store_id,
                });

            if (!data.length) {
                return res
                    .status(404)
                    .json({ message: 'client does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOneClientByStore(req, res) {
        const { store_id, client_id } = req.params;

        try {
            const data = await connection('clients')
                .join('users', 'users.userId', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .select(
                    'clients.clientId',
                    'clients.user_id',
                    'users.store_id',
                    'users.avatar_id',

                    'users.userName',
                    'users.email',
                    'clients.dateOfBirth',
                    'clients.cpf',

                    'addresses.zipcode',
                    'addresses.street',
                    'addresses.number',
                    'addresses.complement',
                    'addresses.neighborhood',
                    'addresses.city',
                    'addresses.state',
                    'addresses.state_code',
                    'addresses.country',

                    'users.permission'
                )
                .where({
                    'clients.clientId': client_id,
                    'clients.store_id': store_id,
                    'users.store_id': store_id,
                });

            if (!data.length) {
                return res.status(404).json({ message: 'client not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async updateOneClientByStore(req, res) {
        const { store_id, client_id } = req.params;
        const { dateOfBirth, cpf } = req.body;

        try {
            const data = await connection('clients')
                .where({ clientId: client_id, store_id })
                .update({ dateOfBirth, cpf }, ['dateOfBirth', 'cpf']);

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return console.error({ stack: err.stack });
        }
    }

    async deleteOneClientByStore(req, res) {
        const { client_id } = req.params;
        const { store_id } = req.params;

        try {
            let deleted = true;

            const data = await connection('clients')
                .where({ clientId: client_id, store_id })
                .update({ deleted }, 'deleted');

            if (!data) {
                return res.status(404).json({ message: 'user does not exist' });
            }

            return res.status(200).json({ deletado: true });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new adminClientController();
