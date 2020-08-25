import request from 'supertest';
import app from '../../../src/app';

describe('products', () => {
    it('should be return status code 201', async () => {
        const response = await request(app)
            .post('/products')
            .send({
                "name": "Tenis Vans",
                "isActive": true,
                "keyWords": "calcados, sapatos, tenis, skate",
                "title": "tenis muito legal",
                "descriptionShort": "tenis muito legal",
                "description": "tenis muito legal",
                "sku": 1,
                "costPrice": 190,
                "offerPrice": null,
                "salesPrice": "279",
                "store_id": 1,
                "brand_id": 1
            });

        expect(response.body).toEqual('products performed successfully');
    });
});
