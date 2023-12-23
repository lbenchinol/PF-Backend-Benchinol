import { Router } from "express";

import ProductController from '../../controllers/product.controller.js';
import { privateRouter } from './index.router.js';

const router = Router();

router.get('/products', privateRouter, async (req, res) => {
    const { query: { limit, page, sort, category, stock } } = req;
    try {
        const data = await ProductController.get(limit, page, sort, category, stock);
        const products = data.payload;
        res.render('products', { title: 'Productos', products, style: 'styles.css', user: req.session.user });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;