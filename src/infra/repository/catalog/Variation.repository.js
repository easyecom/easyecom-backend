const connection = require('../../database/connection');

class VariationRepository {
    async create({ payload, store_id }) {
        return await connection('variations')
            .returning('*')
            .insert({
                variationName: payload.variationName,
                isActive: payload.isActive,
                keyWords: payload.keyWords,
                descriptionShort: payload.descriptionShort,
                description: payload.description,
                packagedHeight: payload.packagedHeight,
                packagedLength: payload.packagedLength,
                packagedWidth: payload.packagedWidth,
                weightKg: payload.weightKg,
                freeShipping: payload.freeShipping,
                externalRefId: payload.externalRefId,
                color_id: payload.color_id,
                size_id: payload.size_id,
                store_id,
                product_id: payload.product_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('variations')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('variations')
            .select('*')
            .where({ variationId: id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('variations')
            .select('*')
            .where({
                store_id,
                brandName: payload.brandName,
            });
    }

    async update({ payload, variation_id, store_id }) {
        return await connection('variations')
            .where({ variationId: variation_id, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'variations',
                'store_id', // this code not update store from category
                'externalRefId',
            ]);
    }

    async delete({ variation_id, store_id }) {
        return await connection('variations')
            .where({ variationId: variation_id, store_id })
            .del();
    }
}

module.exports = new VariationRepository();
