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
describe('User API endpoints', () => {
    let token;
    let userId;
    const user = {
        first_name: 'ApiTest',
        last_name: 'User',
        password: 'password123'
    };
    it('POST /users should create a user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.post('/users').send(user);
        expect(res.status).toBe(200);
        expect(res.body.user.first_name).toBe('ApiTest');
        expect(res.body.token).toBeDefined();
        token = res.body.token;
        userId = res.body.user.id;
    }));
    it('GET /users should return list of users when authorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    }));
    it('GET /users/:id should return a single user when authorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.first_name).toBe('ApiTest');
    }));
    it('GET /users should fail without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield request.get('/users');
        expect(res.status).toBe(401);
    }));
});
