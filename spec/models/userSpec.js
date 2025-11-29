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
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../src/models/user");
const store = new user_1.UserStore();
describe('User Model', () => {
    const testUser = {
        first_name: 'Test',
        last_name: 'User',
        password: 'password123'
    };
    let createdUserId;
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });
    it('create should add a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.create(testUser);
        createdUserId = result.id;
        expect(result.first_name).toBe('Test');
        expect(result.last_name).toBe('User');
        expect(createdUserId).toBeDefined();
    }));
    it('index should return a list of users including the created one', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.index();
        const user = result.find((u) => u.first_name === 'Test');
        expect(user).toBeDefined();
    }));
    it('show should return the correct user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.show(createdUserId);
        expect(result.first_name).toBe('Test');
        expect(result.last_name).toBe('User');
    }));
    it('authenticate should return the user with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.authenticate('Test', 'password123');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.first_name).toBe('Test');
        }
    }));
});
