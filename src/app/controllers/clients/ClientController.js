import connection from '../../../database/connection';

class ClientController {
    async store(req, res) {
        const { store_id, client_id: user_id } = req.params;

        const { dateOfBirth, cpf } = req.body;

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

    async findOne({ params }, res) {
        const { client_id } = params;
        const data = await connection('clients').where({ id: client_id });

        return res.status(200).json(data);
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

export default new ClientController();
