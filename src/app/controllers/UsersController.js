import connection from '../../database/connection';

class UsersController {
    async create(req, res) {
        const { name, email, password } = await req.body;

        const data = await connection('users')
            .returning('id')
            .insert({
                name,
                email,
                password,
            });

        return res.status(201).json(data);
    }

    async getAll(req, res) {
        try {
            const users = await connection('users').select('*');

            if (!users.length) {
                return res.status(200).json({ message: 'without users' });
            }

            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err.message);
        }
    }

    async update(req, res) {
        const { id } = req.params;

        // save user data in localstorage
        const { name, email, password, avatar_id } = await req.body;

        const data = await connection('users')
            .where('id', id)
            .update({ name, email, password, avatar_id }, [
                'name',
                'email',
                'password',
                'avatar_id',
            ]);

        return res.json(data);
    }
}

export default new UsersController();
