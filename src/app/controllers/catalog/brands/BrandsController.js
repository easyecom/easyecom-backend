const connection = require('../../../../database/connection');

class BrandsController {
    async store(req, res) {
        const { store_id } = req.params;
        const { brandName, description, isActive, refId } = req.body;

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

            const checkBrandName = await connection('brands')
                .where('brandName', brandName)
                .select('*');

            if (checkBrandName.length) {
                return res.status(400).json({
                    error: 'brand name already exist',
                    message: 'use: PUT - store{id}/brands for update',
                    brand: checkBrandName,
                });
            }

            const data = await connection('brands')
                .returning('*')
                .insert({
                    brandName,
                    description,
                    isActive,
                    refId,
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
            let data = await connection('brands')
                .select('*')
                .where('store_id', store_id);

            if (!data.length) {
                return res.json({ message: 'without brands' });
            }

            return res.status(200).json({brands: data});
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
            const { store_id, brand_id } = req.params;

            const checkStore = await connection('stores')
                .select('*')
                .where('storeId', store_id);

            if (!checkStore.length) {
                return res.json({ error: 'store does not exist' });
            }

            const checkBrandStore = await connection('brands')
                .select('*')
                .where('store_id', store_id);

            if (!checkBrandStore.length) {
                return res.json({ error: 'without brands' });
            }

            const data = await connection('brands')
                .where('brandId', brand_id)
                .select('*');

            if (!data.length) {
                return res.status(404).json({ error: 'brand does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
    async update(req, res) {
        try {
            const { store_id, brand_id } = req.params;
            const {
                brandName,
                description,
                isActive,
                refId,
                products,
            } = req.body;

            const data = await connection('brands')
                .where('brandId', brand_id)
                .update(
                    {
                        brandName,
                        description,
                        isActive,
                        refId,
                        //products,
                        store_id,
                    },
                    [
                        'brandName',
                        'description',
                        'isActive',
                        'refId',
                        // 'products',
                        'store_id',
                    ]
                );

            if (!data.length) {
                return res.status(404).json({ error: 'brand does not exist' });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
    async delete(req, res) {
        try {
            const { store_id, brand_id } = req.params;

            const data = await connection('brands').where({
                'brandId': brand_id, store_id
            });

            if (!data.length) {
                return res.status(404).json({ error: 'brand does not exist' });
            }

            await connection('brands')
                .where('brandId', brand_id)
                .del();

            return res
                .status(200)
                .json({ message: 'brand deleted successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }
}

module.exports = new BrandsController();
