import connection from '../../database/connection';

class AvatarController {
    async create(req, res) {
        const { filename: name, originalname: path } = await req.file;

        const data = await connection('avatar').insert({
            name,
            path,
        });
        return res.json(data);
    }
}

export default new AvatarController();
