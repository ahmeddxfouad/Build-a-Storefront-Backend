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
const product_1 = require("../../src/models/product");
const store = new product_1.ProductStore();
describe('Product Model', () => {
    const testProduct = {
        name: 'Test Product',
        price: 9.99,
        category: 'test-category'
    };
    let createdProductId;
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have a productsByCategory method', () => {
        expect(store.productsByCategory).toBeDefined();
    });
    it('create should add a product', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.create(testProduct);
        createdProductId = result.id;
        expect(result.name).toBe('Test Product');
        expect(Number(result.price)).toBe(9.99);
        expect(result.category).toBe('test-category');
    }));
    it('index should return a list of products including the created one', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.index();
        const prod = result.find((p) => p.name === 'Test Product');
        expect(prod).toBeDefined();
    }));
    it('show should return the correct product', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.show(createdProductId);
        expect(result.name).toBe('Test Product');
        expect(result.category).toBe('test-category');
    }));
    it('productsByCategory should return products in the given category', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield store.productsByCategory('test-category');
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].category).toBe('test-category');
    }));
});
