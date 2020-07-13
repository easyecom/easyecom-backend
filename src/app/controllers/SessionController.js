import jwt from 'jsonwebtoken';
import connection from '../../database/connection';
import authConfig from '../../config/auth';

const bcrypt = require('bcrypt');

class SessionController {
    async create(req, res) {
        try {
            const { email, password } = await req.body;

            if (!email && !password) {
                return res.status(401).json({ message: 'data required' });
            }

            const user = await connection('users')
                .where({ email })
                .select('*')
                .first();

            if (!user) {
                return res.status(404).send({ message: 'user not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password);

            if (!match) {
                return res
                    .status(401)
                    .send({ message: 'password does not match' });
            }

            const { id } = user;

            if (match) {
                const token = jwt.sign(
                    {
                        id,
                    },
                    authConfig.secret,
                    {
                        expiresIn: authConfig.expiresIn,
                    }
                );
                return res
                    .status(200)
                    .json({ message: 'authentication success', token });
            }

            return res
                .status(500)
                .json({ message: 'sorry, something broke...' });
        } catch (e) {
            console.error({
                message: e.message,
                stack: e.stack,
            });
        }
    }
}

export default new SessionController();
