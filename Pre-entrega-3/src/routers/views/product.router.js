import { Router } from "express";

import ProductController from '../../controllers/product.controller.js';
import { privateRouter } from './index.router.js';
import { verifyToken } from '../../utils.js';

const router = Router();

router.get('/products', privateRouter, async (req, res) => {
    const { query: { limit, page, sort, category, stock } } = req;
    try {
        const data = await ProductController.get(limit, page, sort, category, stock);
        const products = data.payload;
        const user = await verifyToken(req.signedCookies.access_token);
        res.render('products', { title: 'Productos', products, style: 'styles.css', user: user });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;