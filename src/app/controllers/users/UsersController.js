const connection = require('../../../database/connection');

const bcrypt = require('bcrypt');

class UsersController {
    async store(req, res) {
        const {
            userName,
            email,
            password,
            store_id,
            refId,
            permission,
        } = req.body;

        let error = [];

        if (!userName) error.push('userName');
        if (!email) error.push('email');
        if (!password) error.push('password');

        if (error.length > 0) {
            return res
                .status(400)
                .json({ error: 'thing that you forgot', required: error });
        }

        const checkStore = await connection('stores').where(
            'storeId',
            store_id
        );
        if (!checkStore.length) {
            return res.status(400).json({ message: 'store does not exist' });
        }

        const checkEmail = await connection('users')
            .select('*')
            .where('email', email);

        // if (checkEmail.length && checkEmail[0].store_id === store_id) {
        //     return res.status(400).json('email alredy exist');
        // }
        if (checkEmail.length) {
            return res.status(400).json('email alredy exist');
        }

        const user = new Promise((resolve, reject) => {
            try {
                bcrypt.hash(String(password), 7, (err, hash) => {
                    if (err) {
                        console.error(err)
                        return reject(err);
                    }
                    resolve(
                        connection('users')
                            .returning('*')
                            .insert({
                                userName,
                                email,
                                password: hash,
                                store_id,
                                refId,
                                permission,
                            })
                    );
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json('sorry, something broke...');
            }
        });

        user.then(result => {
            return res.status(201).send(result);
        }).catch(err => {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        });
    }

    // for dev
    async getAll(req, res) {
        try {
            const users = await connection('users').select('*');

            if (!users.length) {
                return res.status(200).json({ message: 'without users' });
            }

            return res.status(200).json(users);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { userId: user_id } = req;
        try {
            const data = await connection('users')
                .select('*')
                .where('userId', user_id);

            if (!data.length) {
                return res.status(400).json({ message: 'user does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        try {
            const { userId: user_id } = req;

            const {
                userName,
                email,
                avatar_id,
                store_id,
                permission,
            } = await req.body;

            const checkStore = await connection('stores')
                .where('storeId', store_id)
                .select('*');

            if (!checkStore.length) {
                return res.status(400).json({ message: 'store not exist' });
            }

            const data = await connection('users')
                .where('userId', user_id)
                .update({ userName, email, avatar_id, store_id, permission }, [
                    'userName',
                    'email',
                    'avatar_id',
                    'store_id',
                    'permission',
                ]);

            if (!data.length) {
                console.log('user does not exist');
                return res.status(400).json({ message: 'user does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        try {
            const { userId: user_id } = req;

            const data = await connection('users')
                .where('userId', user_id)
                .del();

            if (!data) {
                return res.status(400).json({ message: 'user does not exist' });
            }

            return res
                .status(202)
                .json({ message: 'user deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new UsersController();
