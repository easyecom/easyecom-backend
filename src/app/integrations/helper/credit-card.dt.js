module.exports = async (senderHash, data) => {
    return {
        reference_id: 'ex-00001',
        description: 'Motivo da cobrança',
        amount: {
            value: 1000,
            currency: 'BRL',
        },
        payment_method: {
            type: 'CREDIT_CARD',
            installments: 1,
            capture: false,
            card: {
                number: '4111111111111111',
                exp_month: '03',
                exp_year: '2026',
                security_code: '123',
                holder: {
                    name: 'Jose da Silva',
                },
            },
        },
        notification_urls: [
            'https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/',
        ],
    };
};
