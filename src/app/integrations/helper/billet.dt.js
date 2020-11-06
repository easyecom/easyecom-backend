const { compareAsc, format, addDays } = require('date-fns');

module.exports = async (data, client, address) => {
    const add = addDays(new Date(), 3);
    let due_date = format(add, 'yyyy-MM-dd');

    return {
        reference_id: 'ex-00001',
        description: 'Motivo da cobrança',
        amount: {
            value: data.value,
            currency: 'BRL',
        },
        payment_method: {
            type: 'BOLETO',
            boleto: {
                due_date,
                instruction_lines: {
                    line_1: 'Pagamento processado para DESC Fatura',
                    line_2: 'Via PagSeguro',
                },
                holder: {
                    name: client.userName,
                    tax_id: client.cpf.replace(/\D+/g, ''),
                    email: client.email,
                    address: {
                        country: address.country,
                        region: address.state,
                        region_code: address.state_code,
                        city: address.city,
                        postal_code: address.zipcode.replace('-', ''),
                        street: address.street,
                        number: address.number,
                        locality: address.neighborhood,
                    },
                },
            },
        },
        notification_urls: [
            'https://yourserver.com/nas_ecommerce/277be731-3b7c-4dac-8c4e-4c3f4a1fdc46/',
        ],
    };
};
