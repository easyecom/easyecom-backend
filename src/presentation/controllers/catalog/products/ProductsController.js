const connection = require('../../../../infra/database/connection');
const ProductService = require('../../../../domain/services/catalog/Product.service');

class ProductsController {
    async store({ params, body: products }, res) {
        const { store_id } = params;

        try {
            const results = await ProductService.create({
                payload: products,
                store_id,
            });

            return res.status(201).json(results);
        } catch (err) {
            return console.error(err);
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;
            const { page = 1, limit } = req.query;

            const checkStore = await connection('stores').where({
                storeId: store_id,
            });

            if (!checkStore.length) {
                return res
                    .status(404)
                    .json({ error: { message: 'store does not exist' } });
            }

            const [count] = await connection('products')
                .where({
                    'products.store_id': store_id,
                })
                .count();

            const products = await connection('products')
                .select(
                    'products.*',
                    { offerPrice: 'prices.offerPrice' },
                    { salesPrice: 'prices.salesPrice' },
                    { images: 'images.url' }
                )
                .join('images', 'images.product_id', 'products.productId')
                .join(
                    'variations',
                    'products.productId',
                    'variations.product_id'
                )
                .join(
                    'prices',
                    'prices.variation_id',
                    'variations.variationId'
                )
                .limit(limit)
                .offset((page - 1) * limit)
                .where({
                    'products.store_id': store_id,
                });

            return res.status(200).json({
                data: products,
                params: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(count.count),
                },
            });
        } catch (err) {
            console.log({ message: err.message });
            return res.status(500).json('sorry, something broke...');
        }
    }

    async getOne(req, res) {
        const { store_id, product_id } = req.params;

        try {
            const data = await connection('products')
                .where({ productId: product_id, store_id })
                .select('*');

            if (!data.length) {
                return res
                    .status(404)
                    .json({ error: { message: ' product does not exist' } });
            }

            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async update(req, res) {
        const { store_id, product_id } = req.params;
        let productData = req.body;

        try {
            let checkProduct = await connection('products')
                .where({ productId: product_id, store_id })
                .select('*');

            productData.categoryId = undefined;

            if (!checkProduct.length) {
                return res
                    .status(404)
                    .json({ error: { message: ' product does not exist' } });
            }

            const data = await connection('products')
                .where('productId', product_id)
                .update(productData, [
                    'productName',
                    'isActive',
                    'keyWords',
                    'descriptionShort',
                    'description',
                    'sku',
                    'variations',
                    'images',
                    'evaluations',
                    'externalRefId',
                    'mainCategory',
                    'store_id',
                    'brand_id',
                ]);

            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    async delete(req, res) {
        const { store_id, product_id } = req.params;

        try {
            const checkProduct = await connection('products')
                .where({ productId: product_id, store_id })
                .select('*');

            if (!checkProduct.length) {
                return res
                    .status(404)
                    .json({ error: { message: ' product does not exist' } });
            }
            await connection('products')
                .where('productId', product_id)
                .del();

            return res
                .status(200)
                .json({ message: 'product removed successfully' });
        } catch (err) {
            return res.status(500).json('sorry, something broke...');
        }
    }
}
module.exports = new ProductsController();
