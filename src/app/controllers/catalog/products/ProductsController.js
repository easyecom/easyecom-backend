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
            variations,
            images,
            evaluations,
            costPrice,
            offerPrice,
            salesPrice,
            refId,
            mainCategory,
            categoryId,
            brand_id,
        } = body;

        try {
            let error = [];

            if (!productName) error.push('productName');
            if (!descriptionShort) error.push('descriptionShort');
            if (!sku) error.push('sku');
            if (!salesPrice) error.push('salesPrice');
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

            const checkBrand = await connection('brands')
                .select('*')
                .where({ brandId: brand_id });

            if (!checkBrand.length) {
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
                    variations,
                    images,
                    evaluations,
                    costPrice,
                    offerPrice,
                    salesPrice,
                    refId,
                    mainCategory,
                    store_id,
                    brand_id,
                });

            for (let categoryId of arrayCategoryId) {
                const categoryProduct = await connection('categorie_products')
                    .returning('*')
                    .insert({
                        category_id: categoryId,
                        product_id: data.productId,
                    });
                console.table(categoryProduct);

                let products = [];

                products.push(data.productId);

                const [category] = await connection('categories').where({
                    categoryId,
                    store_id,
                });
                products.push(...category.products);

                let [newProductArray] = await connection('categories')
                    .where({
                        categoryId,
                        store_id,
                    })
                    .update({ products }, ['products']);
                console.table(newProductArray);
            }

            return res.status(201).json(data);
        } catch (err) {
            return console.error(err);
        }
    }

    async getAll(req, res) {
        try {
            const { store_id } = req.params;
            const { page = 1 } = req.query;

            const checkStore = await connection('stores').where({
                storeId: store_id,
            });

            if (!checkStore.length) {
                return res
                    .status(404)
                    .json({ error: { message: 'store does not exist' } });
            }

            const data = await connection('products')
                .join(
                    'categories',
                    'products.productId',
                    'categories.categoryId'
                )
                .join('brands', 'products.brand_id', 'brands.brandId')
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
        const productData = req.body;

        try {
            const checkProduct = await connection('products')
                .where({ productId: product_id, store_id })
                .select('*');

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
                    'costPrice',
                    'offerPrice',
                    'salesPrice',
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
