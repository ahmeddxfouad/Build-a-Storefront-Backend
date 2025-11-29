import express, { Request, Response } from 'express';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middleware/auth';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(Number(req.params.id));
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const { user_id, status } = req.body;

        const order = await store.create({
            user_id: Number(user_id),
            status: status || 'active'
        });

        res.json(order);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const addProduct = async (req: Request, res: Response) => {
    try {
        const order_id = Number(req.params.id);
        const { product_id, quantity } = req.body;

        const orderProduct = await store.addProduct(
            Number(quantity),
            order_id,
            Number(product_id)
        );

        res.json(orderProduct);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const currentByUser = async (req: Request, res: Response) => {
    try {
        const user_id = Number(req.params.user_id);
        const order = await store.currentByUser(user_id);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const completedByUser = async (req: Request, res: Response) => {
    try {
        const user_id = Number(req.params.user_id);
        const orders = await store.completedByUser(user_id);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const orderRoutes = (app: express.Application) => {
    app.get('/orders', verifyAuthToken, index);
    app.get('/orders/:id', verifyAuthToken, show);
    app.post('/orders', verifyAuthToken, create);
    app.post('/orders/:id/products', verifyAuthToken, addProduct);
    app.get('/orders/current/:user_id', verifyAuthToken, currentByUser);
    app.get('/orders/completed/:user_id', verifyAuthToken, completedByUser);
};

export default orderRoutes;
