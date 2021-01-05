const CategoryRepository = require('../../infra/repository/category.repository');
const StoreRepository = require('../../infra/repository/store.repository');
const logger = require('../helpers/logger.helper');

const { isValidFields } = require('../validator/validFields');

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

        const checkStore = await StoreRepository.getById({ storeId: store_id });
        if (!checkStore) return checkStore;

        await logger.success({
            entity: 'categories',
            message: 'Loja valida',
            data: checkStore,
        });

        // validate category exist store

        return await CategoryRepository.create({ payload, store_id });
    }

    async list({ payload, store_id }) {
        return await CategoryRepository.list({ payload, store_id });
    }

    async getById({ payload, store_id }) {
        return await CategoryRepository.getById({ payload, store_id });
    }

    async update({ payload, category_id, store_id }) {
        return await CategoryRepository.update({
            payload,
            category_id,
            store_id,
        });
    }

    async delete({ category_id, store_id }) {
        return await CategoryRepository.delete({
            category_id,
            store_id,
        });
    }
}

module.exports = new CategoryService();
