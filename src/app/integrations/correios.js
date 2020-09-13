const Correios = require('node-correios');
let correios = new Correios();

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

    // const ret = await correios.consultaCEP({ cep: '08773380' });
    // return ret

    try {
        const result = await correios.calcPrecoPrazo({
            nCdServico: '40010', //correiosConfig.nCdServico,
            sCepOrigem: '08773380',
            sCepDestino: '08695400', // clientData.zipcode,
            nVlPeso: '1', //_variation.weightKg,
            nCdFormato: 1,
            nVlComprimento: 16, //_variation.packagedLength,
            nVlAltura: 2, //_variation.packagedHeight,
            nVlLargura: 11, //_variation.packagedWidth,
            nVlDiamentro: 0,
            nVlValorDeclarado: 25.0, //< 19.5 ? 19.5 : 25.0,
        });
        return result;
    } catch (err) {
        return console.error(err);
    }
};

module.exports = { calculateShipping };
