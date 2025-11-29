import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const { TOKEN_SECRET } = process.env;

export const verifyAuthToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Missing Authorization header' });
        }

        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, TOKEN_SECRET as string);

        next();
    } catch (err) {
        res.status(401).json({ error: 'Access denied, invalid token' });
    }
};
