require("util").inspect.defaultOptions.depth = null;
const axios = require('axios').default;
const pagseguroConfig = require('../../config/pagseguro');
const billetDataTranformed = require('./helper/billet.dt');
const { baseUrl } = pagseguroConfig;

const _createPaymentBillet = async (senderHash, data) => {
    const billet = await billetDataTranformed(senderHash, data);

    console.log('teste data');
    const result = axios
        .post(`${baseUrl}/charges`, billet, {
            headers: {
                // ['Content-Type']: 'application/json',
                Authorization: '9D3C5D6F23A94740AE28675BDBB2BA67',
                ['x-api-version']: '4.0',
            },
        })
        .then(({ data }) => {
            return console.log(data);
        })
        .catch(err => console.error(err));
    return result;
};

const _createPaymentCreditCard = async (senderHash, data) => {
    const billet = await billetDataTranformed();
    return function() {
        axios
            .post(`${baseUrl}/charges`, billet, {
                Authorization: '9D3C5D6F23A94740AE28675BDBB2BA67',
                ['x-api-version']: '4.0',
            })
            .then(response => {
                console.log(response, 'response');
            })
            .catch(err => console.log(err));
    };
};

const createPayment = async (senderHash, data) => {
    const teste = 'boleto';
    try {
        if (teste == 'boleto') {
            console.log('createPayment');
            return await _createPaymentBillet(senderHash, data);
        }
        if (data.payment.paymentForm == 'creditCard') {
            return await _createPaymentCreditCard(senderHash, data);
        }
        return { error: 'invalid payment form' };
    } catch (err) {
        console.log(err);
        return { error: 'something broke' };
    }
};

module.exports = { createPayment };
