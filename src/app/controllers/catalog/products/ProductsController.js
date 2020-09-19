const connection = require('../../../../database/connection');

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
            costPrice,
            offerPrice,
            salesPrice,
            refId,
            mainCategory,
            categories,
            brandId,
        } = body;

        try {
            let error = [];

            if (!productName) error.push('productName');
            if (!descriptionShort) error.push('descriptionShort');
            if (!sku) error.push('sku');
            if (!salesPrice) error.push('salesPrice');
            if (!categories) error.push('categories');
            if (!brandId) error.push('brandId');

            if (error.length > 0) {
                return res
                    .status(404)
                    .json({ error: 'missing data', required: error });
            }

            let arrayCategoryId = [];

            for (let category of categories) {
                const checkCategory = await connection('categories').where(
                    'categoryId',
                    category
                );

                if (!arrayCategoryId.length) {
                    return res
                        .status(404)
                        .json({ message: 'category does not exist' });
                }

                arrayCategoryId.push(category);
            }

            const checkBrand = await connection('brands')
                .select('*')
                .where({ brandId: brandId });

            if (!checkBrand.length) {
                return res
                    .status(404)
                    .json({ message: 'brands does not exist' });
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

            const data = await connection('products')
                .returning('*')
                .insert({
                    productName,
                    isActive,
                    keyWords,
                    title,
                    descriptionShort,
                    description,
                    sku,
                    costPrice,
                    offerPrice,
                    salesPrice,
                    refId,
                    mainCategory,
                    store_id,
                    brandId,
                });

            await connection('categories').where('categoryId', category_id);
            data.products.push(data[0].productId);

            console.log(data);

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
                .join(
                    'categories',
                    'products.productId',
                    'categories.categoryId'
                )
                .join('brands', 'products.productId', 'brands.brandId')
                .limit(20)
                .offset((page - 1) * 20)
                .select(
                    'products.productId',
                    'products.productName',
                    'products.descriptionShort',
                    'products.salesPrice',
                    'products.offerPrice',
                    'brands.brandName',
                    'categories.categoryName'
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
                .where('productId', product_id)
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
            productName,
            isActive,
            keyWords,
            title,
            descriptionShort,
            description,
            sku,
            costPrice,
            offerPrice,
            salesPrice,
            refId,
            brandId,
        } = req.body;

        try {
            const data = await connection('products')
                .where('productId', product_id)
                .update(
                    {
                        productName,
                        isActive,
                        keyWords,
                        title,
                        descriptionShort,
                        description,
                        sku,
                        costPrice,
                        offerPrice,
                        salesPrice,
                        refId,
                        brandId,
                    },
                    [
                        'productName',
                        'isActive',
                        'keyWords',
                        'title',
                        'descriptionShort',
                        'description',
                        'sku',
                        'costPrice',
                        'offerPrice',
                        'salesPrice',
                        'refId',
                        'brandId',
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
