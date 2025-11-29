import { UserStore, User } from '../../src/models/user';

const store = new UserStore();

describe('User Model', () => {
    const testUser: User = {
        first_name: 'Test',
        last_name: 'User',
        password: 'password123'
    };

    let createdUserId: number | undefined;

    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have an authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });

    it('create should add a user', async () => {
        const result = await store.create(testUser);
        createdUserId = result.id;
        expect(result.first_name).toBe('Test');
        expect(result.last_name).toBe('User');
        expect(createdUserId).toBeDefined();
    });

    it('index should return a list of users including the created one', async () => {
        const result = await store.index();
        const user = result.find((u) => u.first_name === 'Test');
        expect(user).toBeDefined();
    });

    it('show should return the correct user', async () => {
        const result = await store.show(createdUserId as number);
        expect(result.first_name).toBe('Test');
        expect(result.last_name).toBe('User');
    });

    it('authenticate should return the user with correct credentials', async () => {
        const result = await store.authenticate('Test', 'password123');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.first_name).toBe('Test');
        }
    });
});
