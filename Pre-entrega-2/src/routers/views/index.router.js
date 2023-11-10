import { Router } from "express";

import ProductManager from '../../dao/productManager.js';

const router = Router();

router.get('/', async (req, res) => {
    const data = await ProductManager.getProducts();
    const products = data.payload;
    res.render('index', { products });
});

export default router;