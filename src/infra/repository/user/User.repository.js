const connection = require('../../database/connection');

class UserRepository {
    async create({ payload }) {
        const [results] = await connection('users')
            .returning('*')
            .insert({
                userName: payload.userName,
                email: payload.email,
                password: payload.password,
                store_id: payload.store_id,
                refId: payload.refId,
                permission: payload.permission,
            });

        delete results.password && delete results.permission;

        return results;
    }

    async checkDuplicateEmail({ payload }) {
        return await connection('users')
            .select('*')
            .where({
                store_id: payload.store_id,
                email: payload.email,
            });
    }

    // async list({ page, store_id }) {
    //     return await connection('users')
    //         .limit(10)
    //         .offset((parseInt(page) - 1) * 10)
    //         .where({ store_id })
    //         .select('*');
    // }

    // async getById({ id, store_id }) {
    //     return await connection('users')
    //         .select('*')
    //         .where({ categoryId: id, store_id });
    // }

    // async update({ payload, category_id, store_id }) {
    //     return await connection('users')
    //         .where({ categoryId: category_id, store_id })
    //         .update(payload, [
    //             'categoryName',
    //             'isActive',
    //             'description',
    //             'products',
    //             'store_id', // this code not update store from category
    //             'refId',
    //         ]);
    // }

    // async delete({ category_id, store_id }) {
    //     return await connection('users')
    //         .where({ categoryId: category_id, store_id })
    //         .del();
    // }
}

module.exports = new UserRepository();
