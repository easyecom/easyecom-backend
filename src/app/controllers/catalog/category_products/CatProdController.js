const connection = require('../../../../database/connection');

class Category_product_controller {
    async getById(req, res) {
        const { store_id, category_id } = req.params;
        const { page = 1, limit } = req.query;

        const results = await connection('products')
            .limit(limit)
            .offset((page - 1) * limit)
            .join('variations', 'products.productId', 'variations.product_id')
            .join('prices', 'prices.variation_id', 'variations.variationId')
            .join('stocks', 'stocks.variation_id', 'variations.variationId')
            .join('images', 'images.variation_id', 'variations.variationId')
            .join('brands', 'brands.brandId', 'products.brand_id')
            .select(
                'variations.*',
                { brand_id: 'brands.brandId' },
                { stock: 'stocks.quantity' },
                { price: 'prices.salesPrice' },
                { promotion: 'prices.offerPrice' },
                { images: 'images.name' },
                { category_id: 'products.mainCategory' }
            )
            // .select('*')
            .where({
                'products.store_id': store_id,
                'products.mainCategory': category_id,
            });

        return res.status(200).json({
            infos: {
                page: parseInt(page),
                limit: limit,
                total: results.length,
            },
            results: results,
        });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json('sorry, something broke...');
    }
}

module.exports = new Category_product_controller();
