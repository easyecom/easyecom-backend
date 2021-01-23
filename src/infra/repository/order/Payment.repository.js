const connection = require('../../database/connection');

class PaymentRepository {
    async create({ payload, store_id }) {
        return await connection('payment')
            .returning('*')
            .insert({
                value: payload.value,
                paymentForm: payload.paymentForm,
                installment: payload.installment,
                paymentStatus: payload.paymentStatus,
                codeGateway: payload.codeGateway,
                address_id: payload.address_id,
                cards: payload.cards,
                order_id: payload.order_id,
                deliveryAddressEqualBilling:
                    payload.deliveryAddressEqualBilling,
                store_id,
            });
    }

    async list({ page, store_id }) {
        return await connection('payments')
            .limit(10)
            .offset((parseInt(page) - 1) * 10)
            .where({ store_id })
            .select('*');
    }
}

module.exports = new PaymentRepository();
