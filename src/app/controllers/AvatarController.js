import connection from '../../database/connection';

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
}

export default new AvatarController();
