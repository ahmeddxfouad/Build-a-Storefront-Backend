import { ProductStore, Product } from '../../src/models/product';

const store = new ProductStore();

describe('Product Model', () => {
    const testProduct: Product = {
        name: 'Test Product',
        price: 9.99,
        category: 'test-category'
    };

    let createdProductId: number | undefined;

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

    it('create should add a product', async () => {
        const result = await store.create(testProduct);
        createdProductId = result.id;
        expect(result.name).toBe('Test Product');
        expect(Number(result.price)).toBe(9.99);
        expect(result.category).toBe('test-category');
    });

    it('index should return a list of products including the created one', async () => {
        const result = await store.index();
        const prod = result.find((p) => p.name === 'Test Product');
        expect(prod).toBeDefined();
    });

    it('show should return the correct product', async () => {
        const result = await store.show(createdProductId as number);
        expect(result.name).toBe('Test Product');
        expect(result.category).toBe('test-category');
    });

    it('productsByCategory should return products in the given category', async () => {
        const result = await store.productsByCategory('test-category');
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].category).toBe('test-category');
    });
});
