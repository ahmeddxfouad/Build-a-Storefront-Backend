import { UserStore, User } from '../../src/models/user';
import { ProductStore, Product } from '../../src/models/product';
import { OrderStore, Order } from '../../src/models/order';

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

describe('Order Model', () => {
    let userId: number;
    let productId: number;
    let orderId: number;

    beforeAll(async () => {
        // create a user
        const u: User = {
            first_name: 'OrderTest',
            last_name: 'User',
            password: 'password123'
        };
        const user = await userStore.create(u);
        userId = user.id as number;

        // create a product
        const p: Product = {
            name: 'Order Test Product',
            price: 19.99,
            category: 'order-test'
        };
        const product = await productStore.create(p);
        productId = product.id as number;
    });

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

    it('create should add an active order for the user', async () => {
        const o: Order = {
            user_id: userId,
            status: 'active'
        };
        const result = await orderStore.create(o);
        orderId = result.id as number;

        expect(result.user_id).toBe(userId);
        expect(result.status).toBe('active');
    });

    it('addProduct should add a product to the order', async () => {
        const result = await orderStore.addProduct(2, orderId, productId);
        expect(result.order_id).toBe(orderId);
        expect(result.product_id).toBe(productId);
        expect(result.quantity).toBe(2);
    });

    it('currentByUser should return the active order for the user', async () => {
        const current = await orderStore.currentByUser(userId);
        expect(current).not.toBeNull();
        if (current) {
            expect(current.user_id).toBe(userId);
            expect(current.status).toBe('active');
        }
    });

    it('completedByUser should return completed orders for the user', async () => {
        // mark the existing order as complete
        const conn = (await (await import('../../src/database')).default.connect());
        await conn.query('UPDATE orders SET status = $1 WHERE id = $2', [
            'complete',
            orderId
        ]);
        conn.release();

        const completed = await orderStore.completedByUser(userId);
        expect(completed.length).toBeGreaterThan(0);
        expect(completed[0].status).toBe('complete');
    });
});
