"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../src/server"));
const request = (0, supertest_1.default)(server_1.default);
describe('Order API endpoints', () => {
    let token;
    let userId;
    let productId;
    let orderId;
    const user = {
        first_name: 'OrderApi',
        last_name: 'User',
        password: 'password123'
    };
    const product = {
        name: 'Order API Product',
        price: 25.5,
        category: 'order-api'
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create user and get token
        const userRes = yield request.post('/users').send(user);
        token = userRes.body.token;
        userId = userRes.body.user.id;
        // create product
        const prodRes = yield request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product);
        productId = prodRes.body.id;
    }));
    it('POST /orders should create an active order for the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, status: 'active' });
        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(userId);
        expect(res.body.status).toBe('active');
        orderId = res.body.id;
    }));
    it('POST /orders/:id/products should add a product to the order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post(`/orders/${orderId}/products`)
            .set('Authorization', `Bearer ${token}`)
            .send({ product_id: productId, quantity: 3 });
        expect(res.status).toBe(200);
        expect(res.body.order_id).toBe(orderId);
        expect(res.body.product_id).toBe(productId);
        expect(res.body.quantity).toBe(3);
    }));
    it('GET /orders/current/:user_id should return current active order', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/orders/current/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.user_id).toBe(userId);
        expect(res.body.status).toBe('active');
    }));
    it('GET /orders/completed/:user_id should return completed orders', () => __awaiter(void 0, void 0, void 0, function* () {
        // mark order as complete using API (or you could do raw SQL in a model test)
        yield request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({ user_id: userId, status: 'complete' });
        const res = yield request
            .get(`/orders/completed/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].status).toBe('complete');
    }));
    it('GET /orders should fail without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/orders');
        expect(res.status).toBe(401);
    }));
});
