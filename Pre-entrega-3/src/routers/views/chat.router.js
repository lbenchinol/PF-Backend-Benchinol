import { Router } from "express";

const router = Router();

router.get('/chat', (req, res) => {
    res.render('chat',{style: 'styles.css'});
});

export default router;