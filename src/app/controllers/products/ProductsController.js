import connection from '../../../database/connection';

class ProductsController {
    async store(req, res) {
        const { store_id } = req.params;
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

            const checkName = await connection('products')
                .where('name', name)
                .select('*');

            if (checkName.length) {
                return res.status(400).json('name already exist');
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
            const data = await connection('products');

            return res.status(200).json(data);
        } catch (err) {
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
            console.error(err)
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

export default new ProductsController();
