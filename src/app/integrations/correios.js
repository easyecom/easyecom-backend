const Correios = require('node-correios');
const correios = new Correios();

const correiosConfig = require('../../config/correios');

const calculateShipping = async (clientData, shoppingCart) => {
    const _variation = shoppingCart.map(item => {
        return {
            weightKg: item.weightKg,
            packagedLength: item.packagedLength,
            packagedHeight: item.packagedHeight,
            packagedWidth: item.packagedWidth,
            quantity: 1,
            price: 200,
        };
    });

    try {
        const result = await correios.calcPrecoPrazo({
            nCdServico: correiosConfig.nCdServico,
            sCepOrigem: '08773-380',
            sCepDestino: clientData.zipcode,
            nVlPeso: _variation.weightKg,
            nCdFormato: 1,
            nVlComprimento: _variation.packagedLength,
            nVlAltura: _variation.packagedHeight,
            nVlLargura: _variation.packagedWidth,
            nVlDiamentro: 0,
            nVlValorDeclarado: 25 < 19.5 ? 19.5 : 25,
        });
        return result;
    } catch (err) {
        console.error(err);
    }
};

module.exports = { calculateShipping };
