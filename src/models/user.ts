import bcrypt from 'bcryptjs';
import client from '../database';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
    id?: number;
    first_name: string;
    last_name: string;
    password: string; // only used for input, not stored directly
};

export class UserStore {
    async index(): Promise<Omit<User, 'password'>[]> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT id, first_name, last_name FROM users';
            const result = await conn.query(sql);
            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Omit<User, 'password'>> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT id, first_name, last_name FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<Omit<User, 'password'>> {
        try {
            const conn = await client.connect();

            const saltRounds = parseInt(SALT_ROUNDS as string, 10);
            const hash = bcrypt.hashSync(
                u.password + BCRYPT_PASSWORD,
                saltRounds
            );

            const sql =
                'INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING id, first_name, last_name';

            const result = await conn.query(sql, [
                u.first_name,
                u.last_name,
                hash
            ]);

            const user = result.rows[0];

            conn.release();
            return user;
        } catch (err) {
            throw new Error(`Could not create user ${u.first_name}. Error: ${err}`);
        }
    }

    async authenticate(
        first_name: string,
        password: string
    ): Promise<Omit<User, 'password'> | null> {
        try {
            const conn = await client.connect();
            const sql = 'SELECT * FROM users WHERE first_name=($1)';
            const result = await conn.query(sql, [first_name]);
            conn.release();

            if (result.rows.length) {
                const user = result.rows[0];

                const isValid = bcrypt.compareSync(
                    password + BCRYPT_PASSWORD,
                    user.password_digest
                );

                if (isValid) {
                    // return user info without password_digest
                    return {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                    };
                }
            }

            return null;
        } catch (err) {
            throw new Error(`Authentication failed. Error: ${err}`);
        }
    }
}
