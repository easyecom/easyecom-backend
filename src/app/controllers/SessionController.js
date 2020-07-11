import connection from '../../database/connection';

const bcrypt = require('bcrypt');

class SessionController {
    async create(req, res) {
        try {
            const { email, password } = await req.body;

            const user = await connection('users')
                .where({ email })
                .select('*')
                .first();

            if (!user) {
                return res.status(401).send({ message: 'User not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password);

            if (match === false) {
                return res
                    .status(401)
                    .send({ message: 'password do not math' });
            }

            if (match) {
                return res.status(200).send({ message: 'login success' });
            }
        } catch (e) {
            console.error({
                message: e.message,
                stack: e.stack,
            });
        }
    }
}

export default new SessionController();
