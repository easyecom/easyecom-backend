const BrandRepository = require('../../../infra/repository/catalog/Brand.repository');
const logger = require('../../../helpers/logger.helper');

const { isValidFields } = require('../../validator/validFields');

class BrandService {
    async create({ payload, store_id }) {
        const isValidate = await isValidFields(payload, [
            'brandName',
            'description',
        ]);

        if (isValidate.error) {
            await logger.error({
                entity: 'brands',
                message: 'Dados Invalidos',
                data: isValidate,
            });
            return isValidate;
        }

        await logger.success({
            entity: 'brands',
            message: 'Dados validos',
            data: isValidate,
        });

        const [checkBrand] = await BrandRepository.checkName({
            payload,
            store_id,
        });

        if (checkBrand) {
            await logger.success({
                entity: 'marca',
                message: 'Essa marca já existe e foi atualizada',
                data: checkBrand,
            });

            return {
                statusCode: 200,
                method: 'update',
                message: 'Brand updated successfully',
                body: await BrandRepository.update({
                    payload,
                    brandId: checkBrand.brandId,
                    store_id,
                }),
            };
        }

        return await BrandRepository.create({ payload, store_id });
    }

    async list({ page, store_id }) {
        return await BrandRepository.list({ page, store_id });
    }

    async getById({ brandId, store_id }) {
        return await BrandRepository.getById({ brandId, store_id });
    }

    async checkName({ payload, store_id }) {
        return await BrandRepository.checkName({ payload, store_id });
    }

    async update({ payload, brandId, store_id }) {
        const [checkBrand] = await BrandRepository.getById({
            brandId,
            store_id,
        });

        if (!checkBrand) {
            await logger.error({
                entity: 'Marcas',
                message: 'marca não existe',
                data: checkBrand,
            });

            return { error: true };
        }

        return await BrandRepository.update({
            payload,
            brandId,
            store_id,
        });
    }

    async delete({ brandId, store_id }) {
        const [checkBrand] = await BrandRepository.getById({
            brandId,
            store_id,
        });

        if (!checkBrand) {
            await logger.error({
                entity: 'marca',
                message: 'Marca não existe',
                data: checkBrand,
            });

            return { error: true };
        }

        return await BrandRepository.delete({
            brandId,
            store_id,
        });
    }
}

module.exports = new BrandService();
