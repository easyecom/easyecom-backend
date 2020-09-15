const connection = require('../../../database/connection');
const { calculateShipping } = require('../../integrations/correios');

class CalculateFreightController {
    async calculate({ body, params }, res) {
        const { store_id, product_id } = params;
        let { zipcode } = body;

        zipcode = zipcode.replace(/\-/g, '');
        
        try {
            const product = await connection('variations').where({
                id: product_id,
                store_id: store_id,
            });

            const calculate = await calculateShipping(product, zipcode);

            return res.status(200).json(calculate);
        } catch (err) {
            return console.error(err);
        }
    }
}

module.exports = new CalculateFreightController();
