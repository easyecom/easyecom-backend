import request from 'supertest';
import app from '../../../src/app';

describe('categories active', () => {
    it('should be return status code 201', async () => {
        const response = await request(app)
            .post('/stores/1/categories')
            .send({
                name: 'example category',
                isActive: true,
                store_id: 1,
                description: "skate life",
            });

        expect(response.body).toEqual('categories performed successfully');
    });
});
