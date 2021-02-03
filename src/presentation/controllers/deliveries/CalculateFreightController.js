const connection = require('../../../infra/database/connection');
const { calculateShipping } = require('../../../main/integrations/correios');

class CalculateFreightController {
    async calculate({ body, params }, res) {
        const { store_id, variation_id } = params;
        let { zipcode } = body;

        zipcode = zipcode.replace(/\-/g, '');

        try {
            // validar se produto existe no carrinho para relizar calculo
            const product = await connection('variations').where({
                variationId: variation_id,
                store_id,
            });

            if (!product.length)
                return res.status(400).json({
                    statusCode: 400,
                    message: 'produc does not exist',
                });

            const [address] = await connection('stores').where({
                'stores.storeId': store_id,
            });

            if (!address) return res.status(400).json('address not exist');

            const storeZipcode = address.zipcode.replace(/\-/g, '');

            let calculate = await calculateShipping(
                product,
                zipcode,
                storeZipcode
            );
            const calculates = calculate.map(item => {
                return {
                    type: item.Codigo == 40010 ? 'SEDEX' : 'PAC',
                    correios_code: item.Codigo,
                    value: parseFloat(item.Valor),
                    deadline: `${item.PrazoEntrega} dias`,
                    deliverySaturday: item.EntregaSabado == 'S' ? 'Sim' : 'Não',
                    delivery:
                        item.EntregaDomiciliar == 'S'
                            ? 'Sim'
                            : item.EntregaDomiciliar,
                    obsFim: item.obsFim ? item.obsFim : undefined,
                    Erro: item.Erro ? item.Erro : undefined,
                    MsgErro: item.MsgErro ? item.MsgErro : undefined,
                };
            });

            res.status(200).json(calculates);
        } catch (err) {
            return console.error(err);
        }
    }
}

module.exports = new CalculateFreightController();
