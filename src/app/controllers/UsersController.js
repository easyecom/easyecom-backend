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

        return res.json(data);
    }

    async getAll(req, res) {
        const users = await connection('users').select('*');

        return res.json(users);
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
