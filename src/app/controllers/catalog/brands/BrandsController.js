const connection = require('../../../../database/connection');

class BrandsController {
    async store(req, res) {
        const { store_id } = req.params;
        const { brandName, description, isActive } = req.body;

        try {
            let error = [];

            if (!brandName) error.push('brandName');
            if (!store_id) error.push('store_id');
            if (!description) error.push('description');

            if (error.length > 0) {
                return res
                    .status(400)
                    .json({ error: 'missing data', required: error });
            }

            const checkBrand = await connection('brands')
                .where('brandName', brandName)
                .select('*');

            if (checkBrand.length) {
                return res.status(400).json({
                    message: 'brand already exist',
                    brand: checkBrand,
                });
            }

            const data = await connection('brands')
                .returning('*')
                .insert({
                    brandName,
                    description,
                    isActive,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
    async getAll(req, res) {
        const { store_id } = req.params;

        try {
            const data = await connection('brands')
                .select('brandId', 'brand', 'description')
                .where('store_id', store_id);

            return res.status(200).json(data);
        } catch (err) {
            console.error({
                message: err.message,
                stack: err.stack,
            });
            return res.status(500).json('sorry, something broke...');
        }
    }
    async getOne(req, res) {
        try {
            const { brand_id } = req.params;

            const data = await connection('brands')
                .where('brandId', brand_id)
                .select('*');

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async update(req, res) {
        try {
            const { brand_id } = req.params;
            const { brandName, description, isActive, store_id } = req.body;

            const data = await connection('brands')
                .where('brandId', brand_id)
                .update({ brandName, description, isActive, store_id }, [
                    'brandName',
                    'description',
                    'isActive',
                    'store_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async delete(req, res) {
        try {
            const { brand_id } = req.params;

            await connection('brands')
                .where('brandId', brand_id)
                .del();

            return res
                .status(200)
                .json({ message: 'brand deleted successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new BrandsController();
