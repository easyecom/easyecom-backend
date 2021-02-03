const connection = require('../infra/database/connection');

module.exports = async (arrayCategoryIds, store_id, data) => {
    for (let categoryId of arrayCategoryIds) {
        let products = [];

        const [category] = await connection('categories').where({
            categoryId,
            store_id,
        }); // call repository

        products.push(data.productId, ...category.products);

        const results = await connection('categories')
            .where({
                categoryId,
                store_id,
            })
            .update({ products }, ['products']); // call repository

        // add logger - results

        return { message: 'category products assigned' };
    }
};
