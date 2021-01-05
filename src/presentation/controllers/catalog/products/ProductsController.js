const connection = require('../../../../infra/database/connection');
const variationImages = require('../../../../domain/helpers/listImagesByVariation.helper');

class ProductsController {
    async store({ params, body }, res) {
        const { store_id } = params;
        const {
            productName,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            sku,
            images,
            refId,
            mainCategory,
            categoryId,
            brand_id,
        } = body;

        try {
            let error = [];

            if (!productName) error.push('productName');
            // if (!descriptionShort) error.push('descriptionShort');
            // if (!sku) error.push('sku');
            if (!brand_id) error.push('brand_id');
            if (!categoryId) error.push('categoryId');

            if (error.length > 0) {
                return res
                    .status(404)
                    .json({ error: 'missing data', required: error });
            }

            let arrayCategoryId = [];

            for (let category of categoryId) {
                const [checkCategoryExist] = await connection(
                    'categories'
                ).where('categoryId', category);

                if (!checkCategoryExist) {
                    return res
                        .status(404)
                        .json({ message: 'category does not exist' });
                }

                arrayCategoryId.push(category);
            }

            const [checkBrand] = await connection('brands')
                .select('*')
                .where({ brandId: brand_id });

            if (!checkBrand) {
                return res
                    .status(404)
                    .json({ error: { message: 'brands does not exist' } });
            }

            const checkName = await connection('products')
                .where('productName', productName)
                .select('*');

            const checkStore = await connection('products')
                .where('store_id', store_id)
                .select('*');

            if (checkName.length && checkStore.length) {
                return res.status(400).json('product already exist');
            }

            const [data] = await connection('products')
                .returning('*')
                .insert({
                    productName,
                    isActive,
                    keyWords,
                    title,
                    descriptionShort,
                    description,
                    sku,
                    variations: [],
                    evaluations: [],
                    images,
                    refId,
                    mainCategory,
                    store_id,
                    brand_id,
                });

            let products = [];

            products.push(data.productId, ...checkBrand.products);

            await connection('brands')
                .where({ brandId: brand_id, store_id })
                .update({ products }, ['products']);

            for (let categoryId of arrayCategoryId) {
                await connection('category_products')
                    .returning('*')
                    .insert({
                        category_id: categoryId,
                        product_id: data.productId,
                    });

                let products = [];

                const [category] = await connection('categories').where({
                    categoryId,
                    store_id,
                });

                products.push(data.productId, ...category.products);

                await connection('categories')
                    .where({
                        categoryId,
                        store_id,
                    })
                    .update({ products }, ['products']);
            }

            return res.status(201).json(data);
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
                        '*',
                        { variationTitle: 'variations.title' },
                        { brand_id: 'brands.brandId' },
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
                delete data.product_id
                delete data.variation_id

                productAll.push(data);
            }

            // return res.json(productAll);

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
