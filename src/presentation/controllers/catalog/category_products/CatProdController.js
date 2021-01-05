const connection = require('../../../../infra/database/connection');
const variationImages = require('../../../../domain/helpers/listImagesByVariation.helper');

class Category_product_controller {
    async getById(req, res) {
        const { store_id, category_id } = req.params;
        const { page = 1, limit } = req.query;

        const [count] = await connection('products')
            .where({
                'products.mainCategory': category_id,
            })
            .count();

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
                'products.mainCategory': category_id,
            });

        const results = await variationImages(products, connection);

        return res.status(200).json({
            statusCode: 200,
            infos: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(count.count),
            },
            results, // ajuste 
        });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json('sorry, something broke...');
    }
}

module.exports = new Category_product_controller();
