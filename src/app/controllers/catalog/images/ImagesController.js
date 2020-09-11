const connection = require('../../../../database/connection');

class ImagesController {
    async store(req, res) {
        try {
            const { product_id, variation_id, brand_id } = req.body;
            const { filename: name, originalname: path } = await req.file;

            const data = await connection('images')
                .returning('id')
                .insert({
                    name,
                    path,
                    product_id,
                    variation_id,
                    brand_id,
                });
            return res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            const file = await connection('images').select('*');
            return res.json(file);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;

            const file = await connection('avatar')
                .where('id', id)
                .select('*');

            if (!file.length) {
                return res.status(204).json({ message: 'user does not exist' });
            }

            return res.status(200).json(file);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const file = await connection('avatar')
                .where('id', id)
                .del();

            if (!file) {
                return res.status(404).json({ message: 'file does not exist' });
            }

            return res.status(202).json({ message: 'deleted success' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new ImagesController();
