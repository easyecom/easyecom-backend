import jwt from 'jsonwebtoken';
import connection from '../../../database/connection';
import authConfig from '../../../config/auth';

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
                    .status(422)
                    .json({ error: 'you forgot', required: error });
            }

            const user = await connection('users')
                .where({ email })
                .select('*')
                .first();

            if (!user) {
                return res.status(404).send({ message: 'user does not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password);

            if (!match) {
                return res
                    .status(401)
                    .send({ message: 'password does not match' });
            }

            const { id } = user;
            const { name } = user;

            if (match) {
                const token = jwt.sign({ id }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                });
                return res.status(200).json({
                    id,
                    name,
                    message: 'authentication success',
                    token,
                });
            }

            return res
                .status(500)
                .json({ message: 'sorry, something broke...' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

export default new SessionController();
