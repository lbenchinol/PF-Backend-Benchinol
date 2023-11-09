import { Router } from "express";

const router = Router();

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts',{style: 'styles.css'});
});

export default router;