const CategoryRepository = require('../../infra/repository/category.repository');
const StoreRepository = require('../../infra/repository/store.repository');
const logger = require('../helpers/logger.helper');

const { isValidFields } = require('../validator/validFields');

class CategoryService {
    async create({ payload, store_id }) {
        // validate fields
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

        // check order
        const checkStore = await StoreRepository.getById({ storeId: store_id });
        if (!checkStore) return checkStore;
        await logger.success({
            entity: 'categories',
            message: 'Loja valida',
            data: checkStore,
        });

        // check category
        const [checkCategory] = await CategoryRepository.checkName({
            payload,
            store_id,
        });

        if (checkCategory) {
            await logger.success({
                entity: 'categories',
                message: 'Essa categoria já existe e foi atualizada',
                data: checkStore,
            });

            return {
                method: 'update',
                body: await CategoryRepository.update({
                    payload,
                    category_id: checkCategory.categoryId,
                    store_id,
                }),
            };
        }

        return await CategoryRepository.create({ payload, store_id });
    }

    async list({ payload, store_id }) {
        return await CategoryRepository.list({ payload, store_id });
    }

    async getById({ id, store_id }) {
        return await CategoryRepository.getById({ id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await CategoryRepository.checkName({ payload, store_id });
    }

    async update({ payload, category_id, store_id }) {
        const [checkCategory] = await CategoryRepository.getById({
            id: category_id,
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
            category_id,
            store_id,
        });
    }

    async delete({ category_id, store_id }) {
        const [checkCategory] = await CategoryRepository.getById({
            id: category_id,
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
            category_id,
            store_id,
        });
    }
}

module.exports = new CategoryService();
