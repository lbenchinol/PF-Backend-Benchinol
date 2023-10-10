import express from 'express';

import cartRouter from './routers/cart.router.js';
import productRouter from './routers/product.router.js';

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Inicio');
});

app.use('/api', cartRouter, productRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});