module.exports = async data => {
    return data.map(item => {
        let totalValue = [];

        for (let prices of item.shoppingCart) {
            totalValue.push(prices.price);
        }

        let value = 0;

        for (let i = 0; i < totalValue.length; i++) {
            value = value += totalValue[i];
        }

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
            payment: '', // make join
            shipping: '', // make join
            is_completed: '', // create database collumn for this field
            items: item.shoppingCart,
            totalValue: parseFloat(value)
                .toFixed(2)
                .replace('.', ','),
            deleted: item.deleted,
            created_at: item.created_at,
            updated_at: item.updated_at,
        };
    });
};
