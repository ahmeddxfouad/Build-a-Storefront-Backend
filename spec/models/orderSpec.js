"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const product_1 = require("../../src/models/product");
const order_1 = require("../../src/models/order");
const userStore = new user_1.UserStore();
const productStore = new product_1.ProductStore();
const orderStore = new order_1.OrderStore();
describe('Order Model', () => {
    let userId;
    let productId;
    let orderId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create a user
        const u = {
            first_name: 'OrderTest',
            last_name: 'User',
            password: 'password123'
        };
        const user = yield userStore.create(u);
        userId = user.id;
        // create a product
        const p = {
            name: 'Order Test Product',
            price: 19.99,
            category: 'order-test'
        };
        const product = yield productStore.create(p);
        productId = product.id;
    }));
    it('should have an index method', () => {
        expect(orderStore.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(orderStore.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(orderStore.create).toBeDefined();
    });
    it('should have an addProduct method', () => {
        expect(orderStore.addProduct).toBeDefined();
    });
    it('should have currentByUser and completedByUser methods', () => {
        expect(orderStore.currentByUser).toBeDefined();
        expect(orderStore.completedByUser).toBeDefined();
    });
    it('create should add an active order for the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const o = {
            user_id: userId,
            status: 'active'
        };
        const result = yield orderStore.create(o);
        orderId = result.id;
        expect(result.user_id).toBe(userId);
        expect(result.status).toBe('active');
    }));
    it('addProduct should add a product to the order', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield orderStore.addProduct(2, orderId, productId);
        expect(result.order_id).toBe(orderId);
        expect(result.product_id).toBe(productId);
        expect(result.quantity).toBe(2);
    }));
    it('currentByUser should return the active order for the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const current = yield orderStore.currentByUser(userId);
        expect(current).not.toBeNull();
        if (current) {
            expect(current.user_id).toBe(userId);
            expect(current.status).toBe('active');
        }
    }));
    it('completedByUser should return completed orders for the user', () => __awaiter(void 0, void 0, void 0, function* () {
        // mark the existing order as complete
        const conn = (yield (yield Promise.resolve().then(() => __importStar(require('../../src/database')))).default.connect());
        yield conn.query('UPDATE orders SET status = $1 WHERE id = $2', [
            'complete',
            orderId
        ]);
        conn.release();
        const completed = yield orderStore.completedByUser(userId);
        expect(completed.length).toBeGreaterThan(0);
        expect(completed[0].status).toBe('complete');
    }));
});
