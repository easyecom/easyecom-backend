require('util').inspect.defaultOptions.depth = null;

const billetDataTranformed = require('./helper/billet.dt');
const creditCardDataTranformed = require('./helper/credit-card.dt');
const creditCardTokenDataTranformed = require('./helper/credit-card-token');
const postPayment = require('./helper/repository');

const createPayment = async (data, client, address) => {
    try {
        if (data.type == 'Boleto') {
            const billetTransformed = await billetDataTranformed(
                data,
                client,
                address
            );
            return await postPayment(billetTransformed);
        }

        if (data.card[0].token) {
            const creditCardTokenTranformed = await creditCardTokenDataTranformed(
                data
            );
            return await postPayment(creditCardTokenTranformed);
        }

        if (data.type == 'Cartao de Credito') {
            const creditCardTranformed = await creditCardDataTranformed(
                data,
                client,
                address
            );
            // return creditCardTranformed
            return await postPayment(creditCardTranformed);
        }
        return { error: 'invalid payment form' };
    } catch (err) {
        console.log(err);
        return { errorMessage: 'something broke', errors: err };
    }
};

module.exports = { createPayment };
