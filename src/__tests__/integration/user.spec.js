require('dotenv').config();
const bcrypt = require('bcryptjs');
const request = require('supertest');
const app = require('../../src/app');

describe('user', () => {
    it('should be create user on database', async () => {
        const response = await request(app).get('/users/dev');

        expect(response.statusCode).toEqual(200);
    });

    let hash;
    it('should encrypt user password', async () => {
        hash = await bcrypt.hash('123', 8);

        const response = await request(app)
            .post('/users')
            .send({
                userName: 'Thiago',
                email: 'thi@gmail.com',
                password: hash,
                store_id: 1,
                permission: ['client', 'admin'],
            });

        expect(response.statusCode).toEqual(201);
    });

    let token;
    it('should decode user password', async () => {
        const response = await request(app)
            .post('/session')
            .send({
                email: 'thi@gmail.com',
                password: hash,
            });

        token = response.body.user.token;

        expect(response.statusCode).toEqual(200);
        expect(response.body.user).toHaveProperty('token');
    });

    it('should get an user', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body[0]).toMatchObject({
            userId: 1,
            userName: 'Thiago',
        });
    });

    // it('should update an user', async () => {
    //     const response = await request(app)
    //         .put('/users')
    //         .send({
    //             userName: 'Thiago Carvalho',
    //             store_id: 1,
    //         })
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(response.statusCode).toEqual(200);
    // });
});
