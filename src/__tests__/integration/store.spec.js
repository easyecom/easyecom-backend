const request = require('supertest');
const app = require('../../src/app');

describe('stores', () => {
    it('should create store', async () => {
        const response = await request(app)
            .post('/stores')
            .send({
                storeName: 'Sid Surf Store',
                cnpj: '11938998.0000.01',
                email: 'contato@sidsurfstore.com',
                cellPhone: '11 2900-2588',
                zipcode: '07273-491',
                street: 'Estrada do Sacramento',
                number: '2020',
                complement: 'Loja',
                neighborhood: 'Pimentas',
                city: 'Guarulhos',
                state: 'São Paulo',
                state_code: 'SP',
                country: 'Brasil',
            });
        expect(response.statusCode).toEqual(201);
    });

    it('should get one store', async () => {
        const response = await request(app).get('/stores/1');
        expect(response.statusCode).toEqual(200);
        expect(response.body[0]).toMatchObject({
            storeId: 1,
            uuid: null,
            storeName: 'Sid Surf Store',
        });
    });

    // it('should update store', async () => {
    //     const response = await request(app)
    //         .put('/stores/1')
    //         .send({
    //             storeName: 'Sid Surf Store',
    //             cnpj: '11938998.0000.01',
    //         });
    //     expect(response.statusCode).toEqual(200);
    // });
});
