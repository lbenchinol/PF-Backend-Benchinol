import { Router } from "express";

const router = Router();

export const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

export const publicRouter = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
}

router.get('/', async (req, res) => {
    res.redirect('/login');
});

router.get('/register', publicRouter, (req, res) => {
    res.render('register', { title: 'Register' });
});

router.get('/login', publicRouter, (req, res) => {
    res.render('login', { title: 'Login', style: 'styles.css' });
});

router.get('/profile', privateRouter, (req, res) => {
    res.render('profile', { title: 'Perfil', user: req.session.user });
});

export default router;