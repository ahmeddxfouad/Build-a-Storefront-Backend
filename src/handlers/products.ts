import express, { Request, Response } from 'express';
import { ProductStore } from '../models/product';
import { verifyAuthToken } from '../middleware/auth';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(Number(req.params.id));
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const product = await store.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        });

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const productsByCategory = async (req: Request, res: Response) => {
    try {
        const category = req.params.category;
        const products = await store.productsByCategory(category);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const productRoutes = (app: express.Application) => {
    app.get('/products', index); // index
    app.get('/products/:id', show); // show
    app.post('/products', verifyAuthToken, create); // create [token required]
    app.get('/products/category/:category', productsByCategory); // optional
};

export default productRoutes;
