const connection = require('../../../../infra/database/connection');
const variationImages = require('../../../../helpers/setImagesInVariation.helper');
const VariationService = require('../../../../domain/services/catalog/Variation.service');

class VariationsController {
    async store({ body: variationsData, params }, res) {
        const { store_id } = params;

        try {
            let error = [];

            if (!variationsData.variationName) error.push('variationName');
            if (!variationsData.product_id) error.push('product_id');

            if (error.length > 0) {
                return res
                    .status(400)
                    .json({ error: 'missing data', required: error });
            }

            const checkProduct = await connection('products')
                .select('*')
                .where({ productId: variationsData.product_id });

            if (!checkProduct.length) {
                return res
                    .status(404)
                    .json({ message: 'product does not exist' });
            }

            const checkVariation = await connection('variations')
                .select('*')
                .where({
                    variationName: variationsData.variationName,
                    store_id: store_id,
                });

            if (checkVariation.length) {
                return res.status(400).json({
                    message: 'variation already exist',
                });
            }

            const [data] = await VariationService.create({
                payload: variationsData,
                store_id
            });

            let variations = [];

            const [product] = await connection('products').where({
                productId: variationsData.product_id,
                store_id,
            });

            variations.push(...product.variations, data.variationId);

            await connection('products')
                .where({ productId: variationsData.product_id, store_id })
                .update({ variations }, [variations]);

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
        }
    }

    async findAll(req, res) {
        const { store_id } = req.params;
        const { page = 1, limit } = req.query;

        try {
            let variations = await connection('variations')
                .limit(limit)
                .offset((page - 1) * limit)
                .leftJoin('prices', 'prices.variation_id', 'variations.variationId')
                .leftJoin('stocks', 'stocks.variation_id', 'variations.variationId')
                .select('*', { product_id: 'variations.product_id' })
                .where({ 'variations.store_id': store_id });

            const results = await variationImages(variations, connection);

            return res.json(results);
        } catch (err) {
            return console.error(err);
        }
    }

    async findOne(req, res) {
        const { store_id, variation_id } = req.params;

        try {
            let data = await connection('variations')
                .join('prices', 'prices.variation_id', 'variations.variationId')
                .join('stocks', 'stocks.variation_id', 'variations.variationId')
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

            const [results] = await variationImages(data, connection);

            return res.status(200).json({ results });
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
