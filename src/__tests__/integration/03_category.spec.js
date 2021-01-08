const request = require('supertest');
const app = require('../../main/app');

describe('category', async () => {
    // it('should create category', async () => {
    //     const response = await request(app)
    //         .post('/categories')
    //         .send({
    //             categoryName: 'New skate',
    //             description: 'Skate',
    //             isActive: true,
    //         })
    //         .set('Authorization', `Bearer ${token}`);
    //     expect(response.statusCode).toEqual(201);
    // });

    it('should return status 400 if does not exist stores', async () => {
        const response = await request(app).get('/stores/1/categories');
        expect(response.statusCode).toEqual(400);
        expect(response.body).toMatchObject({
            statusCode: 400,
            message: 'without category',
        });
    });

    it('should return status 400 if does not exist store', async () => {
        const response = await request(app).get('/stores/1/categories/1');
        expect(response.statusCode).toEqual(400);
        expect(response.body).toMatchObject({
            statusCode: 400,
            message: 'without category',
        });
    });
});
