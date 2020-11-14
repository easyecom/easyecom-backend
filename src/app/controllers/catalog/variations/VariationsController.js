const connection = require('../../../../database/connection');

class VariationsController {
    async store(req, res) {
        const { store_id } = req.params;

        const {
            variationName,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            packagedHeight,
            packagedLength,
            packagedWidth,
            weightKg,
            freeShipping,
            refId,
            product_id,
        } = req.body;

        try {
            let error = [];

            if (!variationName) error.push('variationName');
            if (!descriptionShort) error.push('descriptionShort');
            if (!product_id) error.push('product_id');

            if (error.length > 0) {
                return res
                    .status(400)
                    .json({ error: 'missing data', required: error });
            }

            const checkProduct = await connection('products')
                .select('*')
                .where({ productId: product_id });

            if (!checkProduct.length) {
                return res
                    .status(404)
                    .json({ message: 'product does not exist' });
            }

            const checkVariation = await connection('variations')
                .select('*')
                .where({ variationName: variationName, store_id: store_id });

            if (checkVariation.length) {
                return res.status(400).json({
                    message: 'variation already exist',
                });
            }

            const [data] = await connection('variations')
                .returning('*')
                .insert({
                    variationName,
                    isActive,
                    keyWords,
                    title,
                    descriptionShort,
                    description,
                    packagedHeight,
                    packagedLength,
                    packagedWidth,
                    weightKg,
                    freeShipping,
                    refId,
                    store_id,
                    product_id,
                });

            let variations = [];

            const [product] = await connection('products').where({
                productId: product_id,
                store_id,
            });

            variations.push(...product.variations, data.variationId);

            const [newProductArray] = await connection('products')
                .where({ productId: product_id, store_id })
                .update({ variations }, [variations]);
            console.table(newProductArray);

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;

        try {
            let data = await connection('variations')
                .join('images', 'images.variation_id', 'variations.variationId')
                .join('prices', 'prices.variation_id', 'variations.variationId')
                .join('stocks', 'stocks.variation_id', 'variations.variationId')
                .select('*', { product_id: 'variations.product_id' })
                .where({ 'variations.store_id': store_id });

            data.forEach(
                item =>
                    (item.image = `http://localhost:3777/images/${item.name}`)
            );

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async findOne(req, res) {
        const { store_id, variation_id } = req.params;

        try {
            let [data] = await connection('variations')
                .join('prices', 'prices.variation_id', 'variations.variationId')
                .join('stocks', 'stocks.variation_id', 'variations.variationId')
                .join('images', 'images.variation_id', 'variations.variationId')
                .select(
                    '*',
                    { priceId: 'prices.variation_id' },
                    { stockId: 'stocks.variation_id' },
                    { product_id: 'variations.product_id' },
                    { store_id: 'variations.store_id' }
                )
                .where({
                    'variations.store_id': store_id,
                    variationId: variation_id,
                });

            data.variation_id = undefined; // ambiguo
            data.path = `http://localhost:3777/images/${data.name}`;

            return res.status(200).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async update(req, res) {
        const { store_id, variation_id } = req.params;
        const variationData = req.body;

        try {
            const data = await connection('variations')
                .returning('*')
                .where({ store_id: store_id, variationId: variation_id })
                .update(variationData, [
                    'variationName',
                    'isActive',
                    'keyWords',
                    'title',
                    'descriptionShort',
                    'description',
                    'packagedHeight',
                    'packagedLength',
                    'packagedWidth',
                    'weightKg',
                    'freeShipping',
                    'store_id',
                    'product_id',
                ]);

            return res.status(200).json(data);
        } catch (err) {
            return console.error({ message: err.message, stack: err.stack });
        }
    }

    async delete(req, res) {
        const { store_id, variation_id } = req.params;

        // make role that, if item is equal or less then one, dont permission delete

        try {
            await connection('variations')
                .where({ store_id: store_id, variationId: variation_id })
                .del();

            return res
                .status(200)
                .json({ message: 'variation deleted success' });
        } catch (err) {
            return console.error(err);
        }
    }
}

module.exports = new VariationsController();
