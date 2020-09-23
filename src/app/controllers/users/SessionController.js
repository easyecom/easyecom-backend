const jwt = require('jsonwebtoken');
const connection = require('../../../database/connection');
const authConfig = require('../../../config/auth');

const bcrypt = require('bcrypt');

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
                    .json({ error: 'missing data', required: error });
            }

            let user = await connection('users')
                .where({ email })
                .select('*')
                .first();

            if (!user) {
                return res.status(404).send({ message: 'user does not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password); //

            if (!match) {
                return res
                    .status(401)
                    .send({ message: 'password does not match' });
            }

            if (match) {
                const token = jwt.sign({ id: user.userId }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                });

                user.password = undefined;
                user.permission = undefined;

                return res.status(200).json({ user, token });
            } //

            return res
                .status(500)
                .json({ message: 'sorry, something broke...' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new SessionController();
