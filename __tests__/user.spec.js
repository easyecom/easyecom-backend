const request = require('supertest');
const app = require('../src/app');

describe('user', () => {
    it('should be create user on database', async () => {
        const response = await request(app).get('/users/dev');
        expect(response.statusCode).toEqual(200);
    });
});
