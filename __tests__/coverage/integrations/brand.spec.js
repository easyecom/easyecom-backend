import request from 'supertest';
import app from '../../../src/app';

describe('brands', () => {
    it('should be return status code 201', async () => {
        const response = await request(app)
            .post('/stores/1/brands')
            .send({
                name: 'Vans',
                description: 'Skate life',
                isActive: true,
                store_id: 1,
            });

        expect(response.body).toEqual('brands performed successfully');
    });
});
