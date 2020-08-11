import request from 'supertest';
import app from '../../../src/app';

describe('categories', () => {
    it('should be return status code 201', async () => {
        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Tenis',
                isActive: true,
                store_id: 1,
                products: [1, 2],
            });

        expect(response.body).toEqual('categories performed successfully');
    });
});
