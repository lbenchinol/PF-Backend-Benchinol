import { Router } from 'express';

const router = Router();

import ProductManager from '../productManager.js';
const productManager = new ProductManager('./products.json');

router.get('/products', async (req, res) => {
    const { limit } = req.query;
    if (limit) {
        res.status(200).json(await productManager.getProducts(parseInt(limit)));
    } else {
        res.status(200).json(await productManager.getProducts());
    }
});

router.get('/products/:pId', async (req, res) => {
    const { pId } = req.params;
    const product = await productManager.getProductById(parseInt(pId));
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).send(`Error, el ID:${pId} no se encontró.`);
    }
});

router.post('/products', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;
    if (title == "" || description == "" || price < 0 || code == "" || stock < 0 || category == "") {
        res.status(400).json({ status: 'error', message: 'Ingrese los valores correctamente' });
        return;
    } else {
        await productManager.addProduct(req.body);
        res.status(201).json({ status: 'success', message: 'Producto agregado correctamente' });
    }
});

router.put('/products/:pId', async (req, res) => {
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

router.delete('/products/:pId', async (req, res) => {
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

export default router;