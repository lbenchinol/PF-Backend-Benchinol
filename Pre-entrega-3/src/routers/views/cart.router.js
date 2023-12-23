import { Router } from "express";

import CartController from '../../controllers/cart.controller.js';

const router = Router();

router.get('/cart/:cId', async (req, res) => {
    try {
        const { params: { cId } } = req;
        const cart = await CartController.getById(cId);
        const { _id } = cart;
        const products = cart.products.map(p => p.toJSON());
        res.render('carts', { products, _id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;