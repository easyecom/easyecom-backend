const connection = require('../../../infra/database/connection');

class AvatarController {
    async store(req, res) {
        try {
            const { filename: name, originalname: path } = await req.file;

            const [data] = await connection('avatars')
                .returning('*')
                .insert({
                    name,
                    path,
                });

            // return res.json(data);
            return res.json({
                id: data.id,
                path: `http://localhost:3777/avatar/${data.name}`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            let data = await connection('avatars').select('*');

            data = data.map(item => {
                return {
                    id: item.id,
                    name: item.path,
                    path: `http://localhost:3777/avatar/${item.name}`,
                };
            });
            return res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;

            const [data] = await connection('avatars')
                .where('id', id)
                .select('*');

            if (!data) {
                return res.status(404).json({ message: 'file does not exist' });
            }

            return res.status(200).json({
                id: data.id,
                name: data.path,
                path: `http://localhost:3777/avatar/${data.name}`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const file = await connection('avatars')
                .where('id', id)
                .del();

            if (!file) {
                return res.status(404).json({ message: 'file does not exist' });
            }

            return res
                .status(202)
                .json({ message: 'avatar deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new AvatarController();
