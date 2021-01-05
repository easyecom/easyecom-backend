const bcrypt = require('bcryptjs');
const connection = require('../../../infra/database/connection');
const logger = require('../../../domain/helpers/logger.helper');

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
        logger.start();

        await logger.success({
            entity: 'userController',
            message: 'Start receiving data...',
            data: req.body,
        });

        const checkStore = await connection('stores').where(
            'storeId',
            store_id
        );
        await logger.success({
            entity: 'userController',
            message: 'Checking store exist...',
            data: checkStore,
        });

        if (!checkStore.length && !permission.includes('sup')) {
            await logger.error({
                entity: 'userController',
                message: 'Stop cause store does not exist',
                data: checkStore,
            });
            return res
                .status(400)
                .json({ statusCode: 400, message: 'Store does not exist' });
        }

        const checkEmail = await connection('users')
            .select('*')
            .where('email', email);
        await logger.success({
            entity: 'userController',
            message: 'Checking duplicate emails...',
            data: checkEmail.length ? checkEmail : 'email this ok',
        });

        if (checkEmail.length && checkEmail[0].store_id === store_id) {
            await logger.error({
                entity: 'userController',
                message: 'Stop cause email alredy exist',
                data: checkEmail,
            });

            return res
                .status(400)
                .json({ statusCode: 400, message: 'Email already exist' });
        }

        // if (checkEmail.length) {
        //     return res.status(400).json('email already exist');
        // }

        const user = new Promise((resolve, reject) => {
            try {
                bcrypt.hash(String(password), 7, (err, hash) => {
                    if (err) {
                        console.error(err);
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
                return res.status(500).json({
                    statusCode: 400,
                    message: 'sorry, something broke...',
                });
            }
        });
        await logger.success({
            entity: 'userController',
            message: ' finished create user!',
            data: user,
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
