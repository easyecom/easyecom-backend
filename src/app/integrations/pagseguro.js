require('util').inspect.defaultOptions.depth = null;

const billetDataTranformed = require('./helper/billet.dt');
const creditCardDataTranformed = require('./helper/credit-card.dt');
const postPayment = require('./helper/repository');

const createPayment = async data => {
    try {
        if (data.paymentForm == 'boleto') {
            const billetTransformed = await billetDataTranformed(data);
            return await postPayment(billetTransformed);
        }
        if (data.paymentForm == 'creditCard') {
            const creditCardTranformed = await creditCardDataTranformed(data);
            return await postPayment(creditCardTranformed);
        }
        return { error: 'invalid payment form' };
    } catch (err) {
        console.log(err);
        return { errorMessage: 'something broke', errors: err };
    }
};

module.exports = { createPayment };
