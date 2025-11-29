import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserStore, User } from '../models/user';
import { verifyAuthToken } from '../middleware/auth';

const store = new UserStore();
const { TOKEN_SECRET } = process.env;

const index = async (_req: Request, res: Response) => {
    try {
        const users = await store.index();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(Number(req.params.id));
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: `${err}` });
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password
        };

        const newUser = await store.create(user);
        const token = jwt.sign({ user: newUser }, TOKEN_SECRET as string);
        res.json({ user: newUser, token });
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const { first_name, password } = req.body;
        const user = await store.authenticate(first_name, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ user }, TOKEN_SECRET as string);
        res.json({ user, token });
    } catch (err) {
        res.status(400).json({ error: `${err}` });
    }
};

const userRoutes = (app: express.Application) => {
    app.post('/users', create); // create + return token
    app.post('/users/auth', authenticate);
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
};

export default userRoutes;
