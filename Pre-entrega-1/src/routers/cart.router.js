import { Router } from 'express';

const router = Router();

import CartManager from '../cartManager.js';
const cartManager = new CartManager('./carts.json');

import ProductManager from '../productManager.js';
const productManager = new ProductManager('./products.json');

router.post('/carts', async (req, res) => {
    await cartManager.addCart();
    res.status(201).json({ status: 'success', message: 'Nuevo carrito creado' });
});

router.get('/carts/:cId', async (req, res) => {
    const { cId } = req.params;
    const cart = await cartManager.getCartById(parseInt(cId));
    if (!cart) {
        res.status(404).send(`Error, el ID:${cId} no se encontró.`);
        return;
    } else {
        res.status(200).json(cart);
    }
});

router.post('/carts/:cId/product/:pId', async (req, res) => {
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
        await cartManager.updateCart(parseInt(cId),parseInt(pId), quantity);
        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente' });
    }
});

export default router;