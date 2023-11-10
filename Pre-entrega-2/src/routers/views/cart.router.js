import { Router } from "express";

import CartManager from '../../dao/cartManager.js';

const router = Router();

router.get('/cart/:cId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const cart = await CartManager.getCartById(cId);
        const products = cart.products;
        res.render('carts', { products, cId });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;