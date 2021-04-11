const connection = require('../../../../infra/database/connection');
// const variationImages = require('../../../../domain/helpers/listImagesByVariation.helper');
const variationImages = require('../../../../helpers/listImagesByVariation.helper');

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
                .limit(limit)
                .offset((page - 1) * limit)
                .innerJoin('brands', 'products.brand_id', '=', 'brands.brandId')
                .select('products.*', 'brands.brandName')
                .where({
                    'products.store_id': store_id,
                    'brands.store_id': store_id,
                });

            let productAll = [];
            for (let product of products) {
                const [data] = await connection('products')
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
                    .join(
                        'stocks',
                        'stocks.variation_id',
                        'variations.variationId'
                    )
                    .join('brands', 'brands.brandId', 'products.brand_id')
                    .select(
                        { variations: 'products.variations' },
                        { variationTitle: 'variations.title' },
                        { variationId: 'variations.variationId' },
                        { productId: 'products.productId' },
                        { brand_id: 'brands.brandId' },
                        { brandName: 'brands.brandName' },
                        { category_id: 'products.mainCategory' },
                        { stock: 'stocks.quantity' },
                        { salesPrice: 'prices.salesPrice' },
                        { offerPrice: 'prices.offerPrice' }
                    )
                    .where({
                        'variations.store_id': store_id,
                        variationId: product.variations[0],
                    });

                delete data.products;
                delete data.product_id;
                delete data.variation_id;

                productAll.push(data);
            }

            const results = await variationImages(productAll, connection);

            return res.status(200).json({
                statusCode: 200,
                infos: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(count.count),
                },
                results,
            });
        } catch (err) {
            console.log(err);
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
                    'title',
                    'descriptionShort',
                    'description',
                    'sku',
                    'variations',
                    'images',
                    'evaluations',
                    'refId',
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
