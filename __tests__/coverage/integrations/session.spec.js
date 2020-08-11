import request from 'supertest';
import app from '../../../src/app';

describe('user', () => {
    it('should be return token', async () => {
        const response = await request(app)
            .post('/session')
            .send({
                email: 'thiago@gmail.com',
                password: 12345,
            });

        expect(response.body).toHaveProperty('token');
    });
});
