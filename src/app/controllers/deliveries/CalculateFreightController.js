const connection = require('../../../database/connection');
const { calculateShipping } = require('../../integrations/correios');

class CalculateFreightController {
    async calculate({ body, params }, res) {
        const { store_id, product_id } = params;
        let { zipcode } = body;

        zipcode = zipcode.replace(/\-/g, '');

        try {
            // validar se produto existe no carrinho para relizar calculo
            const product = await connection('variations').where({
                variationId: product_id,
                store_id: store_id,
            });

            const [address] = await connection('stores')
                .join('addresses', 'addresses.addressId', 'stores.id') // need to create new fields for address store id
                .where({ 'stores.storeId': store_id });

            const storeZipcode = address.zipcode.replace(/\-/g, '');

            const [calculate] = await calculateShipping(
                product,
                zipcode,
                storeZipcode
            );

            return res.status(200).json(calculate);
        } catch (err) {
            return console.error(err);
        }
    }
}

module.exports = new CalculateFreightController();
