const connection = require('../../../../infra/database/connection');
const variationImages = require('../../../../helpers/setImagesInVariation.helper');

class BrandProductController {
    async getById({ params, query }, res) {
        const { store_id, brand_id } = params;
        const { page = 1, limit } = query;

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

        const data = await variationImages(products, connection);

        return res.status(200).json({
            data,
            params: {
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

module.exports = new BrandProductController();
