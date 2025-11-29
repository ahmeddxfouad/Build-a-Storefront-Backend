# Storefront Backend API

Backend for an online storefront built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

---

## 1. Setup & Installation

### 1.1 Prerequisites

- Node.js (v16+ recommended, v20 used in development)
- npm
- PostgreSQL running locally (default port 5432)

### 1.2 Install dependencies

From the project root:

```bash
npm install
```

---

## 2. Environment Configuration

Create a `.env` file in the project root:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_dev
POSTGRES_TEST_DB=store_test
POSTGRES_USER=store_user
POSTGRES_PASSWORD=store_password123

BCRYPT_PASSWORD=some_pepper_string
SALT_ROUNDS=10

TOKEN_SECRET=super_secret_jwt_key

ENV=dev
PORT=3000
```

- `BCRYPT_PASSWORD`: “pepper” added to passwords before hashing
- `SALT_ROUNDS`: bcrypt salt rounds (e.g. 10)
- `TOKEN_SECRET`: secret used to sign JWTs

Adjust DB names / credentials as needed.

---

## 3. Database Setup

### 3.1 Create databases and user

Connect to Postgres as a superuser (e.g. `postgres`):

```bash
psql -U postgres
```

Inside `psql`:

```sql
CREATE DATABASE store_dev;
CREATE DATABASE store_test;

CREATE USER store_user WITH PASSWORD 'store_password123';

GRANT ALL PRIVILEGES ON DATABASE store_dev TO store_user;
GRANT ALL PRIVILEGES ON DATABASE store_test TO store_user;
```

### 3.2 db-migrate configuration

Create `database.json` in the project root:

```json
{
  "dev": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_dev",
    "user": "store_user",
    "password": "store_password123"
  },
  "test": {
    "driver": "pg",
    "host": "127.0.0.1",
    "database": "store_test",
    "user": "store_user",
    "password": "store_password123"
  }
}
```

### 3.3 Run migrations

Dev DB:

```bash
npm run db-up
```

Test DB:

```bash
npm run db-up-test
```

> These commands create the `users`, `products`, `orders`, and `order_products` tables in `store_dev` and `store_test`.

---

## 4. Build, Run, and Test

### 4.1 NPM scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "watch": "tsc-watch --onSuccess \"node ./dist/server.js\"",
    "test": "ENV=test npx jasmine",
    "db-up": "db-migrate up",
    "db-down": "db-migrate down",
    "db-up-test": "db-migrate up -e test",
    "db-down-test": "db-migrate down -e test"
  }
}
```

### 4.2 Build & run the server

```bash
npm run build
npm start
# or for auto-rebuild + restart:
npm run watch
```

Server runs at:

```text
http://localhost:3000
```

### 4.3 Run tests

```bash
npm test
```

- Sets `ENV=test` → connects to `store_test`
- Runs model + endpoint tests (User, Product, Order) via Jasmine & SuperTest

---

## 5. Project Structure

```text
.
├── src
│   ├── server.ts
│   ├── database.ts
│   ├── models
│   │   ├── user.ts
│   │   ├── product.ts
│   │   └── order.ts
│   ├── handlers
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   └── middleware
│       └── auth.ts
├── spec
│   ├── models
│   │   ├── userSpec.ts
│   │   ├── productSpec.ts
│   │   └── orderSpec.ts
│   ├── endpoints
│   │   ├── userSpec.ts
│   │   ├── productSpec.ts
│   │   └── orderSpec.ts
│   └── helpers
│       ├── ts-node.js
│       └── reporter.js
├── migrations
├── REQUIREMENTS.md
├── tsconfig.json
├── database.json
└── README.md
```

---

## 6. Database Schema

### users

```sql
id              SERIAL PRIMARY KEY
first_name      VARCHAR(100) NOT NULL
last_name       VARCHAR(100) NOT NULL
password_digest VARCHAR(255) NOT NULL
```

- Passwords are hashed using the **bcrypt algorithm** via `bcryptjs`, using:
    - Salt rounds (`SALT_ROUNDS`)
    - Pepper (`BCRYPT_PASSWORD`)

### products

```sql
id        SERIAL PRIMARY KEY
name      VARCHAR(255) NOT NULL
price     NUMERIC(10,2) NOT NULL
category  VARCHAR(255) NULL
```

### orders

```sql
id       SERIAL PRIMARY KEY
user_id  INTEGER REFERENCES users(id) ON DELETE CASCADE
status   VARCHAR(20) NOT NULL   -- 'active' or 'complete'
```

### order_products

```sql
id          SERIAL PRIMARY KEY
order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE
product_id  INTEGER REFERENCES products(id) ON DELETE CASCADE
quantity    INTEGER NOT NULL
```

---

## 7. API Overview

All endpoints return JSON.  
Protected routes require a JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

### 7.1 Users

#### POST /users

Create a user & return a JWT.

- **Body:**

```json
{
  "first_name": "Alice",
  "last_name": "Doe",
  "password": "password123"
}
```

- **Response:**

```json
{
  "user": {
    "id": 1,
    "first_name": "Alice",
    "last_name": "Doe"
  },
  "token": "<jwt_token>"
}
```

#### POST /users/auth

Authenticate and return JWT.

```json
{
  "first_name": "Alice",
  "password": "password123"
}
```

#### GET /users

- **Protected:** Yes
- Returns list of users.

#### GET /users/:id

- **Protected:** Yes
- Returns single user.

---

### 7.2 Products

#### GET /products

- List all products.

#### GET /products/:id

- Get product by id.

#### POST /products

- **Protected:** Yes
- **Body:**

```json
{
  "name": "Laptop",
  "price": 999.99,
  "category": "electronics"
}
```

#### GET /products/category/:category

- Get products filtered by category.

---

### 7.3 Orders

> All order routes are **JWT-protected**.

#### POST /orders

Create an order:

```json
{
  "user_id": 1,
  "status": "active"
}
```

#### POST /orders/:id/products

Add product to order:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

#### GET /orders

List all orders.

#### GET /orders/:id

Get order by id.

#### GET /orders/current/:user_id

Get the current active order for a user.

#### GET /orders/completed/:user_id

Get all completed orders for a user.

---

## 8. Security & Auth Notes

- Passwords:
    - Never stored in plain text.
    - Hashed using the bcrypt algorithm (`bcryptjs`) with salt + pepper.
- JWTs:
    - Signed with `TOKEN_SECRET`.
    - Issued on `POST /users` (register) and `POST /users/auth` (login).
    - Required for:
        - `GET /users`, `GET /users/:id`
        - `POST /products`
        - All `/orders` routes

---

## 9. Development Notes

- All models have Jasmine tests.
- All main endpoints (Users, Products, Orders) have endpoint tests using SuperTest.
- `REQUIREMENTS.md` documents:
    - Routes (RESTful)
    - Data shapes
    - Database schema mapping.

If the server runs, migrations succeed, and all tests pass (`npm test`), the project is ready for submission ✅  
