require('util').inspect.defaultOptions.depth = null;

const billetDataTranformed = require('./helper/billet.dt');
const creditCardDataTranformed = require('./helper/credit-card.dt');
const postPayment = require('./helper/repository');

const createPayment = async (senderHash, data) => {
    const teste = 'boleto';
    try {
        if (teste == 'boleto') {
            const billetTransformed = await billetDataTranformed(
                senderHash,
                data
            );
            return await postPayment(billetTransformed);
        }
        if (teste == 'creditCard') {
            const creditCardTranformed = await creditCardDataTranformed(
                senderHash,
                data
            );
            return await postPayment(creditCardTranformed);
        }
        return { error: 'invalid payment form' };
    } catch (err) {
        console.log(err);
        return { errorMessage: 'something broke', errors: err };
    }
};

module.exports = { createPayment };
