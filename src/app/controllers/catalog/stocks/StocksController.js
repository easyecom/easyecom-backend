const connection = require('../../../../database/connection');

class PricesController {
    async getAll(req, res) {
        try {
            const { store_id } = req.params;
            // const { page = 1 } = req.query;

            const checkStore = await connection('stores').where({
                storeId: store_id,
            });

            if (!checkStore.length) {
                return res
                    .status(404)
                    .json({ error: { message: 'store does not exist' } });
            }

            const data = await connection('products')
                // .join(
                //     'categories',
                //     'products.productId',
                //     'categories.categoryId'
                // )
                .join('brands', 'products.brand_id', 'brands.brandId')
                // .limit(20)
                // .offset((page - 1) * 20)
                .select(
                    'products.productId',
                    'products.productName',
                    'products.descriptionShort',
                    'brands.brandName',
                    // 'categories.categoryName',
                    'products.variations',
                    'products.evaluations'
                )
                .where({
                    'products.store_id': store_id,
                    'brands.store_id': store_id,
                });

            return res.status(200).json({ products: data });
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
module.exports = new PricesController();
