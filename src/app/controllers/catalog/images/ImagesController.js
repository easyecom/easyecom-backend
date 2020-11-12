const connection = require('../../../../database/connection');

class ImagesController {
    async store(req, res) {
        try {
            const { category_id, product_id, variation_id, brand_id } = req.body;

            const { filename: name, originalname: path } = req.file;

            const [data] = await connection('images')
                .returning('*')
                .insert({
                    name,
                    path,
                    category_id,
                    product_id,
                    variation_id,
                    brand_id
                });

            return res.status(201).json({
                category_id: data.category_id,
                brand_id: data.brand_id,
                product_id: data.product_id,
                variation_id: data.variation_id,
                id: data.id,
                path: `http://localhost:3777/images/${data.name}`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getAll(req, res) {
        try {
            let data = await connection('images').select('*');

            data = data.map(item => {
                return {
                    category_id: item.category_id,
                    brand_id: item.brand_id,
                    product_id: item.product_id,
                    variation_id: item.variation_id,
                    id: item.id,
                    path: `http://localhost:3777/images/${item.name}`,
                };
            });

            return res.status(400).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        try {
            const { id } = req.params;

            const [data] = await connection('images')
                .where('id', id)
                .select('*');

            if (!data) {
                return res
                    .status(404)
                    .json({ message: 'images does not exist' });
            }

            return res.status(200).json({
                category_id: data.category_id,
                brand_id: data.brand_id,
                product_id: data.product_id,
                variation_id: data.variation_id,
                id: data.id,
                path: `http://localhost:3777/images/${data.name}`,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            const file = await connection('images')
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
