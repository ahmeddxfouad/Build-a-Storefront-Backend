import client from '../database';

export type Order = {
    id?: number;
    user_id: number;
    status: string; // 'active' | 'complete'
};

export type OrderProduct = {
    id?: number;
    quantity: number;
    order_id: number;
    product_id: number;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM orders WHERE id = ($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [o.user_id, o.status]);
            const order = result.rows[0];
            conn.release();
            return order;
        } catch (err) {
            throw new Error(
                `Could not create order for user ${o.user_id}. Error: ${err}`
            );
        }
    }

    async addProduct(
        quantity: number,
        order_id: number,
        product_id: number
    ): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql =
                'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [quantity, order_id, product_id]);
            const orderProduct = result.rows[0];
            conn.release();
            return orderProduct;
        } catch (err) {
            throw new Error(
                `Could not add product ${product_id} to order ${order_id}. Error: ${err}`
            );
        }
    }

    async currentByUser(user_id: number): Promise<Order | null> {
        try {
            const conn = await client.connect();
            const sql =
                "SELECT * FROM orders WHERE user_id = ($1) AND status = 'active' ORDER BY id DESC LIMIT 1";
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows[0] || null;
        } catch (err) {
            throw new Error(
                `Could not get current order for user ${user_id}. Error: ${err}`
            );
        }
    }

    async completedByUser(user_id: number): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql =
                "SELECT * FROM orders WHERE user_id = ($1) AND status = 'complete'";
            const result = await conn.query(sql, [user_id]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(
                `Could not get completed orders for user ${user_id}. Error: ${err}`
            );
        }
    }
}
