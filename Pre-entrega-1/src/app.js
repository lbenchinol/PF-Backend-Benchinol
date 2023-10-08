import CartManager from './cartManager.js';
import ProductManager from './productManager.js';

import express from 'express';

const app = express();
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Inicio');
});



app.get('/api/products', async (req, res) => {
    const { limit } = req.query;
    if (limit) {
        res.status(200).json(await productManager.getProducts(parseInt(limit)));
    } else {
        res.status(200).json(await productManager.getProducts());
    }
});

app.get('/api/products/:pId', async (req, res) => {
    const { pId } = req.params;
    const product = await productManager.getProductById(parseInt(pId));
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send(`Error, el ID:${pId} no se encontró.`);
    }
});

app.post('/api/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;
    if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
        res.status(400).json({ status: 'error', message: 'Ingrese los valores correctamente' });
        return;
    } else {
        await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', message: 'Producto agregado correctamente' });
    }
});

app.put('/api/products/:pId', async (req, res) => {
    const { pId } = req.params;
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;
    const product = await productManager.getProductById(parseInt(pId));
    if (!product) {
        res.status(404).send(`Error, el ID:${pId} no se encontró.`);
        return;
    } else if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
        res.status(400).json({ status: 'error', message: 'Ingrese los valores correctamente' });
        return;
    } else {
        await productManager.updateProduct(parseInt(pId), req.body);
        res.status(200).json({ status: 'success', message: 'Producto actualizado correctamente' });
    }
});

app.delete('/api/products/:pId', async (req, res) => {
    const { pId } = req.params;
    const product = await productManager.getProductById(parseInt(pId));
    if (!product) {
        res.status(404).send(`Error, el ID:${pId} no se encontró.`);
        return;
    } else {
        await productManager.deleteProduct(parseInt(pId));
        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    }
});



app.post('/api/carts', async (req, res) => {
    await cartManager.addCart();
    res.status(201).json({ status: 'success', message: 'Nuevo carrito creado' });
});

app.get('/api/carts/:cId', async (req, res) => {
    const { cId } = req.params;
    const cart = await cartManager.getCartById(parseInt(cId));
    if (!cart) {
        res.status(404).send(`Error, el ID:${cId} no se encontró.`);
        return;
    } else {
        res.status(200).json(cart);
    }
});

app.post('/api/carts/:cId/product/:pId', async (req, res) => {
    const { cId } = req.params;
    const { pId } = req.params;
    const { quantity } = req.body;
    const cart = await cartManager.getCartById(parseInt(cId));
    const product = await productManager.getProductById(parseInt(pId));
    if (!cart) {
        res.status(404).send(`Error, el ID:${cId} no se encontró.`);
        return;
    } else if (!product) {
        res.status(404).send(`Error, el ID:${pId} no se encontró.`);
        return;
    } else if (quantity < 1) {
        res.status(400).json({ status: 'error', message: 'Ingrese los valores correctamente' });
        return;
    } else {
        await cartManager.updateCart(parseInt(cId), req.body);
        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente' });
    }
});




app.listen(8080, () => {
    console.log('Servidor iniciado.');
});