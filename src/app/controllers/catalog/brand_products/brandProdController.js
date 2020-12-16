const connection = require('../../../../database/connection');
const variationImages = require('../../../../helpers/listImagesByVariation.helper');

class Brand_product_controller {
    async getById(req, res) {
        const { store_id, brand_id } = req.params;
        const { page = 1, limit } = req.query;

        const products = await connection('products')
            .limit(limit)
            .offset((page - 1) * limit)
            .join('variations', 'products.productId', 'variations.product_id')
            .join('prices', 'prices.variation_id', 'variations.variationId')
            .join('stocks', 'stocks.variation_id', 'variations.variationId')
            .join('brands', 'brands.brandId', 'products.brand_id')
            .select(
                'variations.*',
                { brand_id: 'brands.brandId' },
                { stock: 'stocks.quantity' },
                { salesPrice: 'prices.salesPrice' },
                { offerPrice: 'prices.offerPrice' },
                { category_id: 'products.mainCategory' }
            )
            .where({
                'products.store_id': store_id,
                'products.brand_id': brand_id,
            });

        const results = await variationImages(products, connection);

        return res.status(200).json({
            results,
            infos: {
                page: parseInt(page),
                limit: limit,
                total: results.length,
            },
        });
    }
    catch(err) {
        console.error({
            message: err.message,
            stack: err.stack,
        });
        return res.status(500).json('sorry, something broke...');
    }
}

module.exports = new Brand_product_controller();
