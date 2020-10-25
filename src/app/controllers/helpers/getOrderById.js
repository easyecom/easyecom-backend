module.exports = async ({res, connection, store_id, order_id }) => {
    try {
        let data = await connection('orders')
            .join('clients', 'clients.clientId', 'orders.client_id')
            .join('users', 'clients.user_id', 'users.userId')
            .join('addresses', 'addresses.user_id', 'users.userId')
            .where({
                'orders.orderId': order_id,
                'orders.store_id': store_id,
            })
            .select('*');

        if (!data.length) {
            return res
                .status(400)
                .json({ message: 'order does not exist' });
        }

        const { shoppingCart } = data[0];

        let items = [];

        for (let item of shoppingCart) {
            const [product] = await connection('products').where(
                'productId',
                item.product_id
            );
            const [variation] = await connection('variations').where(
                'variationId',
                item.variation_id
            );
            const data = {
                name: variation.variationName,
                amount: variation.amount,
                freeShipping: variation.freeShipping,
                costPrice: variation.costPrice,
                offerPrice: variation.offerPrice,
                salesPrice: variation.salesPrice,
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
                },
                payment: '', // make join
                shipping: '', // make join
                is_completed: '', // create database collumn for this field
                items: items,
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
