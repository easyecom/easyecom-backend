const Correios = require('node-correios');
let correios = new Correios();

const calculateShipping = async (shoppingCart, zipCode, storeZipcode) => {
    const _variation = await shoppingCart.map(item => {
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
        const result = await correios.calcPrecoPrazo({
            nCdServico: '40010', 
            sCepOrigem: storeZipcode,
            sCepDestino: zipCode, 
            nVlPeso: '1', //_variation.weightKg,
            nCdFormato: 1,
            nVlComprimento: _variation[0].packagedLength,
            nVlAltura: _variation[0].packagedHeight,
            nVlLargura: _variation[0].packagedWidth,
            nVlDiamentro: 0,
            nVlValorDeclarado: 75.0, //< 19.5 ? 19.5 : 25.0,
        });
        return result;
    } catch (err) {
        return console.error(err);
    }
};

module.exports = { calculateShipping };
