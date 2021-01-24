const BrandRepository = require('../infra/repository/catalog/Brand.repository');

class addProduct {
    async addObjProduct(data, checkBrand) {
        let products = [];

        products.push(data.productId, ...checkBrand.products);

        const [updateBrandPruduct] = await BrandRepository.updateProductArray({
            payload: products,
            brandId: checkBrand.brandId,
            store_id: checkBrand.store_id,
        });

        return updateBrandPruduct;
    }

    async addArrayProduct() {}
}

module.exports = new addProduct();
