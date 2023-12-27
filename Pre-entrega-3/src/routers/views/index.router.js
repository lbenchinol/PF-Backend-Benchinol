import { Router } from "express";

import { verifyToken } from '../../utils.js';

const router = Router();

export const privateRouter = (req, res, next) => {
    if (!req.signedCookies.access_token) {
        return res.redirect('/login');
    }
    const isTokenVerified = verifyToken(req.signedCookies.access_token);
    if (!isTokenVerified) {
        return res.redirect('/login');
    }
    next();
};

export const publicRouter = async (req, res, next) => {
    if (req.signedCookies.access_token) {
        const isTokenVerified = await verifyToken(req.signedCookies.access_token);
        if (isTokenVerified) {
            return res.redirect('/products');
        }
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

router.get('/profile', privateRouter, async (req, res) => {
    const user = await verifyToken(req.signedCookies.access_token);
    res.render('profile', { title: 'Perfil', user: user });
});

export default router;