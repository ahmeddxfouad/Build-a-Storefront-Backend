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
describe('Product API endpoints', () => {
    let token;
    let productId;
    const user = {
        first_name: 'ProductApi',
        last_name: 'User',
        password: 'password123'
    };
    const product = {
        name: 'API Test Product',
        price: 15.5,
        category: 'api-category'
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create a user and get a token
        const res = yield request.post('/users').send(user);
        token = res.body.token;
    }));
    it('POST /products should create a product when authorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send(product);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('API Test Product');
        productId = res.body.id;
    }));
    it('GET /products should return a list of products', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    }));
    it('GET /products/:id should return a single product', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(productId);
    }));
    it('GET /products/category/:category should return products in that category', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/products/category/api-category');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].category).toBe('api-category');
    }));
    it('POST /products should fail without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.post('/products').send(product);
        expect(res.status).toBe(401);
    }));
});
