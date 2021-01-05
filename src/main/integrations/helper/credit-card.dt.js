module.exports = async data => {
    return {
        reference_id: 'ex-00001',
        description: 'Motivo da cobrança',
        amount: {
            value: data.value,
            currency: 'BRL',
        },
        payment_method: {
            type: 'CREDIT_CARD',
            installments: data.installment,
            capture: false,
            card: {
                number: data.card[0].number,
                exp_month: data.card[0].exp_month,
                exp_year: data.card[0].exp_year,
                security_code: data.card[0].security_code,
                store: true,
                holder: {
                    name: data.card[0].holder.name,
                },
            },
        },
        notification_urls: [
            'https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/',
        ],
    };
};
