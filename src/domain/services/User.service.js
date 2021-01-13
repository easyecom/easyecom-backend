const UserRepository = require('../../infra/repository/User.repository');
const StoreRepository = require('../../infra/repository/store.repository');
const logger = require('../../helpers/logger.helper');
const hashPassword = require('../../helpers/hashPassword.helper');

const { isValidFields } = require('../validator/validFields');

class UserService {
    async create({ payload }) {
        const missingData = await isValidFields(payload, [
            'userName',
            'email',
            'password',
            'store_id',
            'permission',
        ]);

        if (missingData.error) return missingData;

        const checkStore = await StoreRepository.getById({
            storeId: payload.store_id,
        });

        if (!checkStore.length) return { storeEmpty: true };

        const [checkDuplicateEmail] = await UserRepository.checkDuplicateEmail({
            payload,
        });

        if (checkDuplicateEmail) return { duplicateEmail: true };

        payload = await hashPassword(payload);

        return await UserRepository.create({ payload });
    }

    async list({ payload, store_id }) {
        return await UserRepository.list({ payload, store_id });
    }

    async getById({ id, store_id }) {
        return await UserRepository.getById({ id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await UserRepository.checkName({ payload, store_id });
    }

    async update({ payload, category_id, store_id }) {
        const [checkCategory] = await UserRepository.getById({
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

        return await UserRepository.update({
            payload,
            category_id,
            store_id,
        });
    }

    async delete({ category_id, store_id }) {
        const [checkCategory] = await UserRepository.getById({
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

        return await UserRepository.delete({
            category_id,
            store_id,
        });
    }
}

module.exports = new UserService();
