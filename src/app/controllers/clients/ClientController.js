const connection = require('../../../database/connection');

class ClientController {
    async store(req, res) {
        const { store_id } = req.params;

        const { dateOfBirth, cpf, user_id } = req.body;

        const checkCpf = await connection('clients').where('cpf', cpf);

        if (checkCpf.length) {
            return res.status(400).json({ message: 'client already exist' });
        }

        let error = [];

        if (!dateOfBirth) error.push('dateOfBirth');
        if (!cpf) error.push('cpf');
        if (!store_id) error.push('store_id');

        if (error.length > 0) {
            return res
                .status(400)
                .json({ error: 'missing data', required: error });
        }

        try {
            const data = await connection('clients')
                .returning('*')
                .insert({
                    dateOfBirth,
                    cpf,
                    user_id,
                    store_id,
                });
            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async findAll({ params }, res) {
        const { store_id } = params;
        const data = await connection('clients').where({ store_id: store_id });
        return res.status(200).json(data);
    }

    async findOne({ params }, res) {
        // make where for N address
        const { store_id, client_id } = params;
        try {
            const data = await connection('clients')
                .join('users', 'users.userId', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.userId')
                .where({
                    'clients.clientId': client_id,
                    'users.store_id': store_id,
                    'addresses.store_id': store_id,
                });

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async update(req, res) {
        const { client_id } = req.params;
        const clients = req.body;

        try {
            const data = await connection('clients')
                .where({ clientId: client_id })
                .update(clients, ['dateOfBirth', 'cpf']);

            return res.status(200).json(data);
        } catch (err) {
            return console.error({ stack: err.stack });
        }
    }

    async delete(req, res) {
        const { client_id } = req.params;

        try {
            let deleted = true;

            const data = await connection('clients')
                .where('clientId', client_id)
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

module.exports = new ClientController();
