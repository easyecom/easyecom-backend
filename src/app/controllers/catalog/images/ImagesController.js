const connection = require('../../../../database/connection');
// const { catch } = require('../category_products/CatProdController');

class ImagesController {
    async store(req, res) {
        try {
            const {
                category_id,
                product_id,
                variation_id,
                brand_id,
            } = req.body;

            const images = req.files;

            let newImages = [];
            for (let { originalname, filename } of images) {
                const result = await connection('images')
                    .returning('*')
                    .insert({
                        name: originalname,
                        path: filename,
                        category_id,
                        product_id,
                        variation_id,
                        brand_id,
                    });
                newImages.push(...result);
            }

            return res.json(newImages);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                category_id,
                product_id,
                variation_id,
                brand_id,
            } = req.body;

            const images = req.files;
            
            let newUpdateImages = [];
            for (let { originalname, filename } of images) {
                const result = await connection('images')
                    .where('images.id', id)
                    .update(
                        {
                            name: originalname,
                            path: filename,
                            category_id,
                            product_id,
                            variation_id,
                            brand_id,
                        },
                        [
                            'name',
                            'path',
                            'category_id',
                            'product_id',
                            'variation_id',
                            'brand_id',
                        ]
                    );
                newUpdateImages.push(...result);
            }

            return res.json(newUpdateImages);
        } catch (err) {
            return console.error(err);
        }
    }

    async getAll(req, res) {
        try {
            let data = await connection('images').select('*');

            return res.status(200).json(data);
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

            return res.status(200).json(data);
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
