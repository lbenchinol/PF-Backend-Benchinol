import { Router } from 'express';
import passport from 'passport';

import UserController from '../../controllers/user.controller.js';
import { authMiddleware } from '../../utils.js';

const router = Router();

router.post('/session/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    res.redirect('/login');
});

router.post('/session/login', async (req, res) => {
    try {
        const { body: { email, password } } = req;
        const user = await UserController.authenticate(email, password);
        req.session.user = user;
        const { token } = user;
        res
            .cookie('access_token', token, { maxAge: 60000, httpOnly: true, signed: true })
            .redirect('/products');
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }

});

router.post('/session/local', passport.authenticate('local', { failureRedirect: '/login' }), async (req, res) => {
    const { body: { email, password } } = req;
    const user = await UserController.authenticate(email, password);
    req.session.user = user;
    const { token } = user;
    res
        .cookie('access_token', token, { maxAge: 60000, httpOnly: true, signed: true })
        .redirect('/products');
});

router.get('/session/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/session/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/current', authMiddleware('jwt'), (req, res) => {
    res.status(200).json(req.user);
});

router.get('/session/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});

export default router;