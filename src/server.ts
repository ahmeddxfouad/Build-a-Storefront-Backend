import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';




const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(cors());
app.use(bodyParser.json());

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.get('/', function (_req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});

export default app;
