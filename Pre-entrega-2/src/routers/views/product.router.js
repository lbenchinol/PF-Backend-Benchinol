import { Router } from "express";

import ProductManager from '../../dao/productManager.js';

const router = Router();

router.get('/products', async (req, res) => {
    const { query: { limit, page, sort, category, stock } } = req;
    try {
        const data = await ProductManager.getProducts(limit, page, sort, category, stock);
        const products = data.payload;
        res.render('products', { products });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;