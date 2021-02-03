const CategoryRepository = require('../../../infra/repository/catalog/Category.repository');
const logger = require('../../../helpers/logger.helper');

const { isValidFields } = require('../../validator/validFields');

class CategoryService {
    async create({ payload, store_id }) {
        const isValidate = await isValidFields(payload, [
            'categoryName',
            'description',
        ]);

        if (isValidate.error) {
            await logger.error({
                entity: 'categories',
                message: 'Dados Invalidos',
                data: isValidate,
            });
            return isValidate;
        }

        await logger.success({
            entity: 'categories',
            message: 'Dados validos',
            data: isValidate,
        });

        const [checkCategory] = await CategoryRepository.checkName({
            payload,
            store_id,
        });

        if (checkCategory) {
            await logger.success({
                entity: 'categories',
                message: 'Essa categoria já existe e foi atualizada',
                data: checkCategory,
            });

            return {
                statusCode: 200,
                method: 'update',
                message: 'category updated successfully',
                body: await CategoryRepository.update({
                    payload,
                    categoryId: checkCategory.categoryId,
                    store_id,
                }),
            };
        }

        return await CategoryRepository.create({ payload, store_id });
    }

    async list({ page, store_id }) {
        return await CategoryRepository.list({ page, store_id });
    }

    async getById({ categoryId, store_id }) {
        return await CategoryRepository.getById({ categoryId, store_id });
    }

    async checkName({ payload, store_id }) {
        return await CategoryRepository.checkName({ payload, store_id });
    }

    async update({ payload, categoryId, store_id }) {
        const [checkCategory] = await CategoryRepository.getById({
            categoryId,
            store_id,
        });

        if (!checkCategory) {
            await logger.error({
                entity: 'categories',
                message: 'Categoria não existe',
                data: checkCategory,
            });

            return { error: true };
        }

        return await CategoryRepository.update({
            payload,
            categoryId,
            store_id,
        });
    }

    async delete({ categoryId, store_id }) {
        const [checkCategory] = await CategoryRepository.getById({
            categoryId,
            store_id,
        });

        if (!checkCategory) {
            await logger.error({
                entity: 'categories',
                message: 'Categoria não existe',
                data: checkCategory,
            });

            return { error: true };
        }

        return await CategoryRepository.delete({
            categoryId,
            store_id,
        });
    }
}

module.exports = new CategoryService();
