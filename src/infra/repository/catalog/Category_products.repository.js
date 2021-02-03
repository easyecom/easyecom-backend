const connection = require('../../database/connection');

class CategoryProductRepository {
    async create(categoryId, productId) {
        return await connection('category_products')
            .returning('*')
            .insert({
                category_id: categoryId,
                product_id: productId,
            });
    }
}

module.exports = new CategoryProductRepository();
