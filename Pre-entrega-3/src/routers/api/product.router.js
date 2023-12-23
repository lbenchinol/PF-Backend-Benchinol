import { Router } from 'express';

import { emitFromApi } from '../../socket.js';
import ProductController from '../../controllers/product.controller.js';

const router = Router();

router.get('/products', async (req, res) => {
    const { query: { limit, page, sort, category, stock } } = req;
    try {
        res.status(200).json(await ProductController.get(limit, page, sort, category, stock));
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.get('/products/:pId', async (req, res) => {
    try {
        const { params: { pId } } = req;
        const product = await ProductController.getById(pId);
        res.status(200).json(product);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        await ProductController.create(req.body);

        const newProducts = await ProductController.get();
        emitFromApi('products-list-updated', { newProducts });

        res.status(201).json({ status: 'success', message: 'Producto agregado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.put('/products/:pId', async (req, res) => {
    try {
        const { params: { pId } } = req;
        await ProductController.updateById(pId, req.body);
        res.status(200).json({ status: 'success', message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

router.delete('/products/:pId', async (req, res) => {
    try {
        const { params: { pId } } = req;
        await ProductController.deleteById(pId);
        res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
});

export default router;