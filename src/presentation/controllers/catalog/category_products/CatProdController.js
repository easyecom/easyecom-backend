const connection = require('../../../../infra/database/connection');
const variationImages = require('../../../../helpers/listImagesByVariation.helper');

class CategoryProductController {
    async getById(req, res) {
        const { store_id, category_id } = req.params;
        const { page = 1, limit } = req.query;

        const [count] = await connection('products')
            .where({
                'products.mainCategory': category_id,
            })
            .count();

        const products = await connection('products')
            .select(
                'products.*',
                { offerPrice: 'prices.offerPrice' },
                { salesPrice: 'prices.salesPrice' },
                { images: 'images.url' }
            )
            .join('images', 'images.product_id', 'products.productId')
            .join('variations', 'products.productId', 'variations.product_id')
            .join('prices', 'prices.variation_id', 'variations.variationId')
            .limit(limit)
            .offset((page - 1) * limit)
            .where({
                'products.store_id': store_id,
                'products.mainCategory': category_id,
            });

        return res.status(200).json({
            data: products,
            params: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: parseInt(count.count),
            },
        });
    }
    catch(err) {
        console.error(err);
        return res.status(500).json('sorry, something broke...');
    }
}

module.exports = new CategoryProductController();
