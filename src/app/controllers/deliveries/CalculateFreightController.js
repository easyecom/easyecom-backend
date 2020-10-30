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
                store_id,
            });

            const [address] = await connection('stores')
                .join('addresses', 'addresses.store_id', 'stores.storeId') // need to create new fields for address store id
                .where({ 'stores.storeId': store_id });

            if (!address) return res.status(400).json('address not exist');

            const storeZipcode = address.zipcode.replace(/\-/g, '');

            let calculate = await calculateShipping(
                product,
                zipcode,
                storeZipcode
            );

            return res.status(200).json({
                correios_code: calculate.Codigo,
                value: parseFloat(calculate.Valor),
                deadline: `${calculate.PrazoEntrega} dias`,
                deliverySaturday:
                    calculate.EntregaSabado == 'S'
                        ? 'Sim'
                        : "Não",
                delivery:
                    calculate.EntregaDomiciliar == 'S'
                        ? 'Sim'
                        : calculate.EntregaDomiciliar,
                obs: calculate.obsFim ? calculate.obsFim : undefined,
                obs: calculate.Erro ? calculate.Erro : undefined,
                obs: calculate.MsgErro ? calculate.MsgErro : undefined,
            });
        } catch (err) {
            return console.error(err);
        }
    }
}

module.exports = new CalculateFreightController();
