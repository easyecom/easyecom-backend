module.exports = async (senderHash, data) => {
    return {
        reference_id: 'ex-00001',
        description: 'Motivo da cobrança',
        amount: {
            value: 25000,
            currency: 'BRL',
        },
        payment_method: {
            type: 'BOLETO',
            boleto: {
                due_date: '2020-11-07',
                instruction_lines: {
                    line_1: 'Pagamento processado para DESC Fatura',
                    line_2: 'Via PagSeguro',
                },
                holder: {
                    name: 'Dariane Lourdes',
                    tax_id: '44952971040',
                    email: 'dariane@gmail.com',
                    address: {
                        country: 'Brasil',
                        region: 'São Paulo',
                        region_code: 'SP',
                        city: 'Mogi das Cruzes',
                        postal_code: '07190020',
                        street: 'Rua Rubbens Henrique Picchi',
                        number: '311',
                        locality: 'Aeroporto',
                    },
                },
            },
        },
        notification_urls: [
            'https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/',
        ],
    };
};
