const jwt = require('jsonwebtoken');
const connection = require('../../../database/connection');
const authConfig = require('../../../config/auth');

const bcrypt = require("bcryptjs");

class SessionController {
    async create(req, res) {
        try {
            const { email, password } = req.body;

            let error = [];

            if (!email) error.push('email');
            if (!password) error.push('password');

            if (error.length > 0) {
                return res
                    .status(400)
                    .send({ error: 'missing data', required: error });
            }

            let user = await connection('users')
                .where({ email })
                .select('*')
                .first();

            if (!user) {
                return res.status(400).send({ message: 'user does not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password); //

            if (!match) {
                return res
                    .status(401)
                    .send({ message: 'password does not match' });
            }

            if (match) {
                const token = jwt.sign(
                    {
                        payload: {
                            id: user.userId,
                            userName: user.userName,
                            role: user.permission,
                            store_id: user.store_id,
                        },
                    },
                    authConfig.secret,
                    {
                        expiresIn: authConfig.expiresIn,
                    }
                );

                user.permission = undefined;
                user.password = undefined;
                user.token = token;

                return res.status(200).send({ user });
            } //

            return res
                .status(500)
                .send({ message: 'sorry, something broke...' });
        } catch (err) {
            console.error(err);
            return res.status(500).send('sorry, something broke...');
        }
    }
}

module.exports = new SessionController();
