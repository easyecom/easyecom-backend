import connection, { select } from '../../database/connection';

class AvatarController {
    async create(req, res) {
        const { filename: name, originalname: path } = await req.file;

        const data = await connection('avatar')
            .returning('id')
            .insert({
                name,
                path,
            });
        return res.json(data);
    }

    async getAll(req, res) {
        const file = await connection('avatar').select('*');
        return res.json(file);
    }

    async getOne(req, res) {
        const { id } = req.params;

        const file = await connection('avatar')
            .where('id', id)
            .select('*');

        if (!file.length) {
            return res.status(204).json({ message: 'user not exist' });
        }

        return res.status(200).json(file);
    }

    async delete(req, res) {
        const { id } = req.params;

        const file = await connection('avatar')
            .where('id', id)
            .del();

        if (!file) {
            return res.status(404).json({ message: 'file not exist' });
        }

        return res.status(202).json({ message: 'deleted success' });
    }
}

export default new AvatarController();
