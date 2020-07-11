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
                return res.status(404).send({ message: 'user not exist' });
            }

            const match = await bcrypt.compare(String(password), user.password);

            if (match === false) {
                return res
                    .status(401)
                    .send({ message: 'password do not match' });
            }

            if (match) {
                return res.status(202).send({ message: 'login success' });
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
