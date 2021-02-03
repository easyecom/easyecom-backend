const CategoryRepository = require('../infra/repository/catalog/Category.repository');
const logger = require('../helpers/logger.helper');

class CheckExist {
    async category({ payload, store_id }) {
        let arrayCategoryId = [];

        const categoryIds = payload.categoryId;
        for (let categoryId of categoryIds) {
            const [checkCategoryExist] = await CategoryRepository.getById({
                categoryId,
                store_id,
            });

            if (checkCategoryExist) {
                arrayCategoryId.push(categoryId);
                continue;
            }

            await logger.error({
                entity: 'categories',
                message: 'Categoria não existe',
                data: { categoryId },
            });
        }
        return arrayCategoryId;
    }
}

module.exports = new CheckExist();
