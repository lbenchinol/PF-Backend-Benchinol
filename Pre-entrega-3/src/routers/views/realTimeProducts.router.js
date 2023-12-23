import { Router } from "express";

import { privateRouter } from './index.router.js';

const router = Router();

router.get('/realtimeproducts', privateRouter, (req, res) => {
    res.render('realtimeproducts', { style: 'styles.css' });
});

export default router;