const bcrypt = require('bcryptjs');
const connection = require('../../../infra/database/connection');
const logger = require('../../../helpers/logger.helper');
const UserService = require('../../../domain/services/user/User.service');

class UsersController {
    async store({ body: users }, res) {
        const results = await UserService.create({ payload: users });

        if (results.error) {
            return res.status(400).json({
                statusCode: 400,
                message: `missing data: ${results.error}`,
            });
        }

        if (results.storeEmpty) {
            return res
                .status(400)
                .json({ statusCode: 400, mesagge: 'Store does not exist' });
        }

        if (results.duplicateEmail) {
            return res
                .status(400)
                .json({ statusCode: 400, mesagge: 'Email already exist' });
        }

        return res.status(201).json(results);
    }

    // for dev
    async getAll(req, res) {
        try {
            const users = await connection('users').select(
                { userId: 'users.userId' },
                { userName: 'users.userName' },
                { email: 'users.email' },
                { store_id: 'users.store_id' },
                { permission: 'users.permission' },
                { externalRefId: 'users.externalRefId' },
                { created_at: 'users.created_at' },
                { updated_at: 'users.updated_at' }
            );

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
                .select(
                    { userId: 'users.userId' },
                    { userName: 'users.userName' },
                    { email: 'users.email' },
                    { store_id: 'users.store_id' },
                    { permission: 'users.permission' },
                    { externalRefId: 'users.externalRefId' },
                    { created_at: 'users.created_at' },
                    { updated_at: 'users.updated_at' }
                )
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
