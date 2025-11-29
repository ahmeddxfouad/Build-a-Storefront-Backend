import supertest from 'supertest';
import app from '../../src/server';
import { User } from '../../src/models/user';
import { Product } from '../../src/models/product';

const request = supertest(app);

describe('Product API endpoints', () => {
    let token: string;
    let productId: number;

    const user: User = {
        first_name: 'ProductApi',
        last_name: 'User',
        password: 'password123'
    };

    const product: Product = {
        name: 'API Test Product',
        price: 15.5,
        category: 'api-category'
    };

    beforeAll(async () => {
        // create a user and get a token
        const res = await request.post('/users').send(user);
        token = res.body.token;
    });

    it('POST /products should create a product when authorized', async () => {
        const res = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('API Test Product');
        productId = res.body.id;
    });

    it('GET /products should return a list of products', async () => {
        const res = await request.get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /products/:id should return a single product', async () => {
        const res = await request.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(productId);
    });

    it('GET /products/category/:category should return products in that category', async () => {
        const res = await request.get('/products/category/api-category');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].category).toBe('api-category');
    });

    it('POST /products should fail without token', async () => {
        const res = await request.post('/products').send(product);
        expect(res.status).toBe(401);
    });
});
