const Correios = require('node-correios');
const correiosConfig = require('../config/correios');
let correios = new Correios();

const calculateShipping = async (cart, zipcode, storeZipcode) => {
    const _variation = await cart.map(item => {
        return {
            weightKg: item.weightKg,
            packagedLength: parseInt(item.packagedLength),
            packagedHeight: parseInt(item.packagedHeight),
            packagedWidth: parseInt(item.packagedWidth),
            quantity: 1,
            price: 200,
        };
    });

    try {
        const results = await Promise.all(
            correiosConfig.nCdServico.split(',').map(async service => {
                let [result] = await correios.calcPrecoPrazo({
                    nCdServico: service,
                    sCepOrigem: storeZipcode,
                    sCepDestino: zipcode,
                    nVlPeso: '1', //_variation.weightKg,
                    nCdFormato: 1,
                    nVlComprimento: _variation[0].packagedLength,
                    nVlAltura: _variation[0].packagedHeight,
                    nVlLargura: _variation[0].packagedWidth,
                    nVlDiamentro: 0,
                    nVlValorDeclarado: 75.0, //< 19.5 ? 19.5 : 25.0,
                });
                return result;
            })
        );
        return results;
    } catch (err) {
        return console.error(err);
    }
};

module.exports = { calculateShipping };
