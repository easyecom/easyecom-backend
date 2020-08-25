import request from 'supertest';
import app from '../../../src/app';

describe('user', () => {
    it('should be create user on database', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'test jest',
                email: 'jest59@gmail.com',
                password: 12345,
            });
        expect(response.body).toEqual('create success');
    });
});
