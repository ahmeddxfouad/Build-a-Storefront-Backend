# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

---

## API Endpoints

### Products

- **Index**
    - `GET /products`
- **Show**
    - `GET /products/:id`
- **Create** *(token required)*
    - `POST /products`
- **[OPTIONAL] Top 5 most popular products**
    - `GET /products/top5`
- **[OPTIONAL] Products by category** (args: product category)
    - `GET /products/category/:category`

---

### Users

- **Index** *(token required)*
    - `GET /users`
- **Show** *(token required)*
    - `GET /users/:id`
- **Create** *(token required – return JWT on creation)*
    - `POST /users`
- **Authenticate (login – needed for tokens, not in original list but required)**
    - `POST /users/auth`

---

### Orders

- **Current Order by user** (args: user id) *(token required)*
    - `GET /orders/current/:user_id`
- **[OPTIONAL] Completed Orders by user** (args: user id) *(token required)*
    - `GET /orders/completed/:user_id`
- **Create Order** *(token required)*
    - `POST /orders`
- **Add Product to Order** *(token required)*
    - `POST /orders/:order_id/products`

---

## Data Shapes

### Product

- id
- name
- price
- [OPTIONAL] category

### User

- id
- firstName
- lastName
- password

### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

---

## Database Schema

### Table: users

- `id` – `SERIAL` PRIMARY KEY
- `first_name` – `VARCHAR(100)` NOT NULL
- `last_name` – `VARCHAR(100)` NOT NULL
- `password_digest` – `VARCHAR(255)` NOT NULL

> (You can optionally add an `email` column if you want email-based auth.)

---

### Table: products

- `id` – `SERIAL` PRIMARY KEY
- `name` – `VARCHAR(255)` NOT NULL
- `price` – `NUMERIC(10, 2)` NOT NULL
- `category` – `VARCHAR(255)` NULL

---

### Table: orders

- `id` – `SERIAL` PRIMARY KEY
- `user_id` – `INTEGER` NOT NULL REFERENCES `users(id)`
- `status` – `VARCHAR(20)` NOT NULL  -- e.g. `'active'` or `'complete'`

---

### Table: order_products` (join table between orders and products)

- `id` – `SERIAL` PRIMARY KEY
- `order_id` – `INTEGER` NOT NULL REFERENCES `orders(id)`
- `product_id` – `INTEGER` NOT NULL REFERENCES `products(id)`
- `quantity` – `INTEGER` NOT NULL
