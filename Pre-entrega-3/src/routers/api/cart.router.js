import { Router } from 'express';

import CartController from '../../controllers/cart.controller.js';

const router = Router();

router.get('/carts', async (req, res) => {
    try {
        const carts = await CartController.get();
        res.status(200).json(carts);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.get('/carts/:cId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const cart = await CartController.getById(cId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/carts', async (req, res) => {
    try {
        await CartController.create();
        res.status(201).json({ status: 'success', message: 'Nuevo carrito creado' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/carts/:cId/product/:pId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const { params: { pId } } = req;
        const { body: { quantity } } = req;
        await CartController.updateById(cId, pId, quantity);
        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/carts/:cId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const { body: { products } } = req;
        await CartController.updateWholeCart(cId, products);
        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/carts/:cId/product/:pId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const { params: { pId } } = req;
        const { body: { quantity } } = req;
        await CartController.updateById(cId, pId, quantity);
        res.status(200).json({ status: 'success', message: 'Carrito actualizado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.delete('/carts/:cId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        await CartController.deleteById(cId);
        res.status(200).json({ status: 'success', message: 'Productos del carrito eliminados correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.delete('/carts/:cId/product/:pId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const { params: { pId } } = req;
        await CartController.deleteProductByIdOnCart(cId, pId);
        res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;