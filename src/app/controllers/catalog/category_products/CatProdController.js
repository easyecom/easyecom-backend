const connection = require('../../../../database/connection');

class Category_product_controller {
    // async store(req, res) {
    //     const { category_id, product_id } = req.body;

    //     let error = [];

    //     if (!category_id) error.push('category_id');
    //     if (!product_id) error.push('product_id');

    //     if (error.length) {
    //         return res.status(400).json({ message: 'error', required: error });
    //     }

    //     try {
    //         const data = await connection('categorie_products')
    //             .returning('*')
    //             .insert({
    //                 category_id,
    //                 product_id,
    //             });

    //         return res.status(201).json(data);
    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json('sorry, something broke...');
    //     }
    // }

    async getById(req, res) {
        const { store_id, category_id } = req.params;

        try {
            const [category] = await connection('categories')
                .select('*')
                .where({ store_id, categoryId: category_id });

            let productAll = [];
            for (let productId of category.products) {
                const data = await connection('products')
                    .select('*')
                    .where({
                        'products.store_id': store_id,
                        'products.productId': productId,
                    });
                productAll.push(...data);
            }

            let newProduct = [];
            for (let product of productAll) {
                const data = await connection('variations')
                    .join(
                        'prices',
                        'prices.variation_id',
                        'variations.variationId'
                    )
                    .join(
                        'products',
                        'products.productId',
                        'variations.product_id'
                    )
                    .join(
                        'stocks',
                        'stocks.variation_id',
                        'variations.variationId'
                    )
                    .join(
                        'images',
                        'images.variation_id',
                        'variations.variationId'
                    )
                    .select(
                        '*',
                        { priceId: 'prices.variation_id' },
                        { stockId: 'stocks.variation_id' },
                        { product_id: 'variations.product_id' },
                        { store_id: 'variations.store_id' }
                    )
                    .where({
                        'variations.store_id': store_id,
                        variationId: product.variations[0],
                    });
                newProduct.push(...data);
            }

            return res.status(200).json(newProduct);
        } catch (err) {
            console.error(err);
            return res.status(500).json('sorry, something broke...');
        }
    }

    // async delete(req, res) {
    //     const { id } = req.params;
    //     try {
    //         await connection('categorie_products')
    //             .where('id', id)
    //             .del();
    //         return res.status(200).json({ message: 'product removed success' });
    //     } catch (err) {
    //         console.error(err);
    //         return res.status(500).json('sorry, something broke...');
    //     }
    // }
}

module.exports = new Category_product_controller();
