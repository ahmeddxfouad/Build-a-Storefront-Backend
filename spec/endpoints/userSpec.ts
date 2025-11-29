import supertest from 'supertest';
import app from '../../src/server';
import { User } from '../../src/models/user';

const request = supertest(app);

describe('User API endpoints', () => {
    let token: string;
    let userId: number;

    const user: User = {
        first_name: 'ApiTest',
        last_name: 'User',
        password: 'password123'
    };

    it('POST /users should create a user and return a token', async () => {
        const res = await request.post('/users').send(user);
        expect(res.status).toBe(200);
        expect(res.body.user.first_name).toBe('ApiTest');
        expect(res.body.token).toBeDefined();

        token = res.body.token;
        userId = res.body.user.id;
    });

    it('GET /users should return list of users when authorized', async () => {
        const res = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /users/:id should return a single user when authorized', async () => {
        const res = await request
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.first_name).toBe('ApiTest');
    });

    it('GET /users should fail without token', async () => {
        const res = await request.get('/users');
        expect(res.status).toBe(401);
    });
});
