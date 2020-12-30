const connection = require('../../../database/connection');
const { createPayment } = require('../../integrations/pagseguro');

class PaymentsController {
    async create(req, res) {
        const { store_id } = req.params;
        const {
            value,
            paymentForm,
            installment,
            paymentStatus,
            codeGateway,
            address_id,
            cards,
            order_id,
            deliveryAddressEqualBilling,
        } = req.body;
        // console.log('start');

        // return createPayment();

        try {
            const data = await connection('payments')
                .returning('*')
                .insert({
                    value,
                    paymentForm,
                    installment,
                    paymentStatus,
                    codeGateway,
                    address_id,
                    cards,
                    order_id,
                    deliveryAddressEqualBilling,
                    store_id,
                });

            return res.paymentStatus(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async findAll(req, res) {
        const data = await connection('payments');
        return res.paymentStatus(200).json(data);
    }
}

module.exports = new PaymentsController();
