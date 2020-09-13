const connection = require('../../../database/connection');

class adminClientController {
    async getClientsByStore(req, res) {
        const { store_id } = req.params;
        const { page = 1 } = req.query;

        try {
            const data = await connection('clients')
                .join('users', 'users.id', 'clients.id')
                .join('addresses', 'addresses.id', 'clients.id')
                .limit(20)
                .offset((page - 1) * 20)
                // .select(
                //     'users.id',
                //     'users.name',
                //     'users.email',
                //     'store_id',
                //     'avatar_id',
                //     'users.permission'
                // )
                .where({ 'users.store_id': store_id });

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOneClientByStore(req, res) {
        const { store_id, client_id } = req.params;
        const { page = 1 } = req.query;

        try {
            const data = await connection('clients')
                .join('users', 'users.id', 'clients.id')
                .join('addresses', 'addresses.id', 'clients.id')
                .limit(20)
                .offset((page - 1) * 20)
                // .select(
                //     'users.id',
                //     'users.name',
                //     'users.email',
                //     'store_id',
                //     'avatar_id',
                //     'users.permission'
                // )
                .where({
                    'clients.id': client_id,
                    'users.store_id': store_id,
                    'addresses.user_id': client_id,
                });

            if (!data.length) {
                return res.status(422).json({ message: 'client not exist' });
            }

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

module.exports = new adminClientController();
