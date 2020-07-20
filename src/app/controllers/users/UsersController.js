import connection from '../../../database/connection';

const bcrypt = require('bcrypt');

class UsersController {
    store(req, res) {
        const { name, email, password } = req.body;

        const user = new Promise((resolve, reject) => {
            try {
                bcrypt.hash(String(password), 7, (err, hash) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(
                        connection('users')
                            .returning('*')
                            .insert({
                                name,
                                email,
                                password: hash,
                            })
                    );
                });
                return res.status(201).json('create success');
            } catch (err) {
                console.error(err);
                return res.status(500).json('sorry, something broke...');
            }
        });

        user.then(result => {
            console.log(result);
        }).catch(err => {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        });
    }

    async getAll(req, res) {
        try {
            const users = await connection('users').select('*');

            if (!users.length) {
                return res.status(404).json({ message: 'without users' });
            }

            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const data = await connection('users')
                .select('*')
                .where('id', id);
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;

            const { name, email, avatar_id } = await req.body;

            const data = await connection('users')
                .where('id', id)
                .update({ name, email, avatar_id }, [
                    'name',
                    'email',
                    'avatar_id',
                ]);

            if (!data.length) {
                return res.status(404).json({ message: 'user does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const data = await connection('users')
                .where('id', id)
                .del();

            if (!data) {
                return res.status(404).json({ message: 'user does not exist' });
            }

            return res.status(202).json({ message: 'deleted success' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new UsersController();
