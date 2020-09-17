const connection = require('../../../../database/connection');

class ProductsController {
    async store({ params, body }, res) {
        const { store_id } = params;
        const {
            name,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            sku,
            costPrice,
            offerPrice,
            salesPrice,
            brand_id,
        } = body;

        try {
            let error = [];

            if (!name) error.push('name');
            if (!descriptionShort) error.push('descriptionShort');
            if (!sku) error.push('sku');
            if (!salesPrice) error.push('salesPrice');
            if (!brand_id) error.push('brand_id');

            if (error.length > 0) {
                return res
                    .status(402)
                    .json({ error: 'you forgot', required: error });
            }

            const checkBrand = await connection('brands')
                .select('*')
                .where({ id: brand_id });

            if (!checkBrand.length) {
                return res
                    .status(402)
                    .json({ message: 'brands does not exist' });
            }

            const checkName = await connection('products')
                .where('name', name)
                .select('*');

            const checkStore = await connection('products')
                .where('store_id', store_id)
                .select('*');

            if (checkName.length && checkStore.length) {
                return res.status(400).json('product already exist');
            }

            const data = await connection('products')
                .returning('*')
                .insert({
                    name,
                    isActive,
                    keyWords,
                    title,
                    descriptionShort,
                    description,
                    sku,
                    costPrice,
                    offerPrice,
                    salesPrice,
                    store_id,
                    brand_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return err;
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;
            const { page = 1 } = req.query;

            const data = await connection('products')
                .join('categories', 'products.id', 'categories.id')
                .join('brands', 'products.id', 'brands.id')
                .limit(20)
                .offset((page - 1) * 20)
                .select(
                    'products.id',
                    'products.name',
                    'products.descriptionShort',
                    'products.salesPrice',
                    'products.offerPrice',
                    'brands.brand',
                    'categories.category'
                )
                .where({
                    'products.store_id': store_id,
                    'brands.store_id': store_id,
                });

            return res.status(200).json(data);
        } catch (err) {
            console.log(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { product_id } = req.params;

        try {
            const data = await connection('products')
                .where('id', product_id)
                .select('*');

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        const { product_id } = req.params;
        const {
            name,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            sku,
            costPrice,
            offerPrice,
            salesPrice,
            brand_id,
        } = req.body;

        try {
            const data = await connection('products')
                .where('id', product_id)
                .update(
                    {
                        name,
                        isActive,
                        keyWords,
                        title,
                        descriptionShort,
                        description,
                        sku,
                        costPrice,
                        offerPrice,
                        salesPrice,
                        brand_id,
                    },
                    [
                        'name',
                        'isActive',
                        'keyWords',
                        'title',
                        'descriptionShort',
                        'description',
                        'sku',
                        'costPrice',
                        'offerPrice',
                        'salesPrice',
                        'brand_id',
                    ]
                );

            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { product_id } = req.params;

        try {
            await connection('products')
                .where('id', product_id)
                .del();

            return res
                .status(201)
                .json({ message: 'product removed successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new ProductsController();
