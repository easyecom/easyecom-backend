module.exports = async (responsePayment, _) => {
    if (responsePayment.payment_method.type == 'CREDIT_CARD') {
        return {
            id: responsePayment.id,
            status: responsePayment.status,
            token: _.get(responsePayment, 'payment_method.card.id'),
        };
    }

    if (responsePayment.payment_method.type == 'BOLETO') {
        return {
            id: responsePayment.id,
            status: responsePayment.status,
            due_date: _.get(responsePayment, 'payment_method.boleto.due_date'),
            message: _.get(responsePayment, 'payment_response.message'),
            barcode: _.get(responsePayment, 'payment_method.boleto.barcode'),
            billet: _.get(responsePayment, 'links[0].href'),
        };
    }
};
