import connection from '../../../database/connection';

class ClientController {
    async store(req, res) {
        try {
            const { dateOfBirth, cpf, user_id } = req.body;

            let error = [];

            if (!dateOfBirth) error.push('dateOfBirth');
            if (!cpf) error.push('cpf');
            if (!user_id) error.push('user');

            if (error.length > 0) {
                return res
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

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
}

export default new ClientController();
