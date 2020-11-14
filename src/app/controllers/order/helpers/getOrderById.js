const countCartValue = require('../util.js/countCartValue');

module.exports = async ({ res, connection, store_id, order_id }) => {
    // console.log(order_id)
    try {
        let data = await connection('orders')
            .join('clients', 'clients.clientId', 'orders.client_id')
            .join('users', 'clients.user_id', 'users.userId')
            .join('addresses', 'addresses.user_id', 'users.userId')
            .join('deliveries', 'deliveries.order_id', 'orders.orderId')
            .join('payments', 'payments.order_id', 'orders.orderId')
            .where({
                'orders.orderId': order_id,
                'orders.store_id': store_id,
            })
            .select('*');

        if (!data.length) {
            return res.status(400).json({ message: 'order does not exist' });
        }

        const { cart } = data[0];

        let items = [];
        let totalValue = [];

        for (let item of cart) {
            const [product] = await connection('products').where(
                'productId',
                item.product_id
            );

            // return item

            const [variation] = await connection('variations')
                .join('prices', 'prices.variation_id', 'variations.variationId')
                .join('stocks', 'stocks.variation_id', 'variations.variationId')
                .where('variationId', item.variation_id);

            const data = {
                name: variation.variationName,
                amount: item.amount,
                freeShipping: variation.freeShipping,
                costPrice: parseInt(variation.costPrice),
                offerPrice: parseInt(variation.offerPrice),
                salesPrice: parseInt(variation.salesPrice),
                refId: variation.refId,
                color: 'vermelho', // create on migration
                measures: 'P', // create on migration

                packagedHeight: variation.packagedHeight,
                packagedLength: variation.packagedLength,
                packagedWidth: variation.packagedWidth,
                weightKg: variation.weightKg,
                CubicWeight: variation.CubicWeight,

                variation_id: variation.variationId,
                product_id: variation.product_id,
            };
            items.push(data);
            totalValue.push(data.offerPrice || data.salesPrice);
        }

        const totalOrderValue = await countCartValue(totalValue);

        let deliveryAddress;
        if (data[0].address_id !== data[0].addressId) {
            deliveryAddress = await connection('addresses').where({
                store_id: store_id,
                addressId: data[0].address_id,
            });
        }

        const [result] = data.map(item => {
            return {
                Id: item.orderId,
                store_id: item.store_id,
                delivery_id: item.delivery_id,

                customer: {
                    userId: item.user_id,
                    cpf: item.cpf,
                    userName: item.userName,
                    email: item.email,
                    dateOfBirth: item.dateOfBirth,
                },
                address: {
                    addressId: item.addressId,
                    zipcode: item.zipcode,
                    street: item.street,
                    number: item.number,
                    complement: item.complement,
                    neighborhood: item.neighborhood,
                    city: item.city,
                    state: item.state,
                    state_code: item.state_code,
                    country: item.country,
                    storeIdToAddress: item.storeIdToAddress,
                },

                shipping: {
                    deliveryId: item.deliveryId,
                    cost: item.cost,
                    status: item.deliveryStatus,
                    time: item.deadline,
                    trackingNumber: item.tracking,
                    type: item.type,
                    address_id: item.address_id,
                    shippingAddress:
                        deliveryAddress && deliveryAddress.length
                            ? deliveryAddress[0]
                            : null,
                },
                items: items,
                totalItemsValue: parseFloat(totalOrderValue).toFixed(2),
                payment: {
                    value: item.value,
                    paymentForm: item.type,
                    installment: item.installment,
                    status: item.paymentStatus,
                    codeGateway: item.codeGateway,
                    address_id: item.address_id,
                    cards: item.cards,
                    order_id: item.order_id,
                    deliveryAddressEqualBilling: true,
                },
                is_completed: false, // create database collumn for this field
                deleted: item.deleted,
                created_at: item.created_at,
                updated_at: item.updated_at,
            };
        });

        return result;
    } catch (err) {
        console.error(err);
    }
};
