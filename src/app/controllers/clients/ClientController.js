const connection = require('../../../database/connection');

class ClientController {
    async store(req, res) {
        const { store_id } = req.params;

        const { dateOfBirth, cpf, user_id } = req.body;

        let error = [];

        if (!dateOfBirth) error.push('dateOfBirth');
        if (!cpf) error.push('cpf');

        if (error.length > 0) {
            return res
                .status(422)
                .json({ error: 'you forgot', required: error });
        }

        try {
            const data = await connection('clients')
                .returning('*')
                .insert({
                    dateOfBirth,
                    cpf,
                    user_id,
                });
            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async findAll({ params }, res) {
        //const { store_id } = params;
        const data = await connection('clients');
        return res.json(data);
    }

    async findOne({ params }, res) {
        // make where for N address
        const { store_id, client_id } = params;
        try {
            const data = await connection('clients')
                .join('users', 'users.id', 'clients.user_id')
                .join('addresses', 'addresses.user_id', 'users.id')
                .where({
                    'clients.id': client_id,
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
                .where({ id: client_id })
                .update(clients, ['dateOfBirth', 'cpf']);

            return res.status(200).json(data);
        } catch (err) {
            return console.error({ stack: err.stack });
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            let deleted = true;

            const data = await connection('clients')
                .where('id', id)
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

module.exports = new ClientController();
