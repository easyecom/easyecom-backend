require('util').inspect.defaultOptions.depth = null;

const billetDataTranformed = require('./helper/billet.dt');
const creditCardDataTranformed = require('./helper/credit-card.dt');
const creditCardTokenDataTranformed = require('./helper/credit-card-token');
const postPayment = require('./helper/repository');

const createPayment = async (data, client, address) => {
    try {
        if (data.paymentForm == 'boleto') {
            const billetTransformed = await billetDataTranformed(
                data,
                client,
                address
            );
            // return billetTransformed;
            return await postPayment(billetTransformed);
        }
        if (data.paymentForm == 'credit_card') {
            const creditCardTranformed = await creditCardDataTranformed(
                data,
                client,
                address
            );
            // return creditCardTranformed
            return await postPayment(creditCardTranformed);
        }
        if (data.paymentForm == 'credit_card_token') {
            const creditCardTokenTranformed = await creditCardTokenDataTranformed(
                data
            );
            // return creditCardTokenTranformed;
            return await postPayment(creditCardTokenTranformed);
        }
        return { error: 'invalid payment form' };
    } catch (err) {
        console.log(err);
        return { errorMessage: 'something broke', errors: err };
    }
};

module.exports = { createPayment };
