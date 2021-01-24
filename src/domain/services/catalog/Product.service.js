const CategoryRepository = require('../../../infra/repository/catalog/Category.repository');
const BrandRepository = require('../../../infra/repository/catalog/Brand.repository');
const ProductRepository = require('../../../infra/repository/catalog/Product.repository');

const logger = require('../../../helpers/logger.helper');
const checkExist = require('../../../helpers/checkExist.helper');
const AddProduct = require('../../../helpers/addProduct.helper');

const { isValidFields } = require('../../validator/validFields');

const connection = require('../../../infra/database/connection');

class ProductService {
    async create({ payload, store_id }) {
        const isValidate = await isValidFields(payload, [
            'productName',
            'descriptionShort',
            'title',
            'mainCategory',
            'brand_id',
            'categoryId',
            'sku',
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

        // check categories exist
        const arrayCategoryIds = await checkExist.category({
            payload,
            store_id,
        });

        if (!arrayCategoryIds) return { checkCategoryExist: false };

        const [checkBrand] = await BrandRepository.getById({
            brandId: payload.brand_id,
            store_id,
        });

        if (!checkBrand) return { checkBrandExist: false };

        const checkName = await ProductRepository.checkName({
            payload,
            store_id,
        });

        const checkStore = await ProductRepository.checkStore({
            store_id,
        });

        // not reapet product in some store
        if (checkName.length && checkStore.length)
            return { CheckProductExist: true };

        const [data] = await ProductRepository.create({ payload, store_id });

        // add productIds at brand
        const updateBrandProduct = await AddProduct.addObjProduct(
            data,
            checkBrand
        ); // nomear melhor esse trecho

        return updateBrandProduct;
        ////////////////////////////////

        for (let categoryId of arrayCategoryIds) {
            // function associate
            await connection('category_products')
                .returning('*')
                .insert({
                    category_id: categoryId,
                    product_id: data.productId,
                });

            // function add product
            let products = [];

            const [category] = await connection('categories').where({
                categoryId,
                store_id,
            });

            products.push(data.productId, ...category.products);

            await connection('categories')
                .where({
                    categoryId,
                    store_id,
                })
                .update({ products }, ['products']);
        }
    }

    async list({ page, store_id }) {
        return await connection('products')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }

    async getById({ id, store_id }) {
        return await connection('products')
            .select('*')
            .where({ productId: id, store_id });
    }

    async checkName({ payload, store_id }) {
        return await connection('products')
            .select('*')
            .where({
                store_id,
                brandName: payload.brandName,
            });
    }

    async update({ payload, product_id, store_id }) {
        return await connection('products')
            .where({ productId: product_id, store_id })
            .update(payload, [
                'productName',
                'isActive',
                'description',
                'products',
                'store_id', // this code not update store from category
                'refId',
            ]);
    }

    async delete({ product_id, store_id }) {
        return await connection('products')
            .where({ productId: product_id, store_id })
            .del();
    }
}

module.exports = new ProductService();
