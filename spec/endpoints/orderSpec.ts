import supertest from 'supertest';
import app from '../../src/server';
import { User } from '../../src/models/user';
import { Product } from '../../src/models/product';

const request = supertest(app);

describe('Order API endpoints', () => {
    let token: string;
    let userId: number;
    let productId: number;
    let orderId: number;

    const user: User = {
        first_name: 'OrderApi',
        last_name: 'User',
        password: 'password123'
    };

    const product: Product = {
        name: 'Order API Product',
        price: 25.5,
        category: 'order-api'
    };

    beforeAll(async () => {
        // create user and get token
        const userRes = await request.post('/users').send(user);
        token = userRes.body.token;
        userId = userRes.body.user.id;

        // create product
        const prodRes = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product);
        productId = prodRes.body.id;
    });

    it('POST /orders should create an active order for the user', async () => {
        const res = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, status: 'active' });

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(userId);
        expect(res.body.status).toBe('active');
        orderId = res.body.id;
    });

    it('POST /orders/:id/products should add a product to the order', async () => {
        const res = await request
            .post(`/orders/${orderId}/products`)
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: productId, quantity: 3 });

        expect(res.status).toBe(200);
        expect(res.body.order_id).toBe(orderId);
        expect(res.body.product_id).toBe(productId);
        expect(res.body.quantity).toBe(3);
    });

    it('GET /orders/current/:user_id should return current active order', async () => {
        const res = await request
            .get(`/orders/current/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(userId);
        expect(res.body.status).toBe('active');
    });

    it('GET /orders/completed/:user_id should return completed orders', async () => {
        // mark order as complete using API (or you could do raw SQL in a model test)
        await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, status: 'complete' });

        const res = await request
            .get(`/orders/completed/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].status).toBe('complete');
    });

    it('GET /orders should fail without token', async () => {
        const res = await request.get('/orders');
        expect(res.status).toBe(401);
    });
});
