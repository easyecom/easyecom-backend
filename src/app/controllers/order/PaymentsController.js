const connection = require('../../../database/connection');

class PaymentsController {
    async create(req, res) {
        const { store_id } = req.params;
        const {
            value,
            paymentForm,
            installment,
            status,
            codeGateway,
            address_id,
            cards,
            order_id,
            deliveryAddressEqualBilling,
        } = req.body;

        try {
            const data = await connection('payments')
                .returning('*')
                .insert({
                    value,
                    paymentForm,
                    installment,
                    status,
                    codeGateway,
                    address_id,
                    cards,
                    order_id,
                    deliveryAddressEqualBilling,
                    store_id,
                });

            return res.status(201).json(data);
        } catch (err) {
            return console.log(err);
        }
    }

    async findAll(req, res) {
        const data = await connection('payments');
        return res.status(200).json(data);
    }
}

module.exports = new PaymentsController();
