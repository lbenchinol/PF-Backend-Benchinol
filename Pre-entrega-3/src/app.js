import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import config from './config/config.js';
import { URI } from './db/mongodb.js'
import { Exception, __dirname } from './utils.js';
import { init as initPassportConfig } from './config/passport.config.js';

import productApiRouter from './routers/api/product.router.js';
import cartApiRouter from './routers/api/cart.router.js';
import sessionApiRouter from './routers/api/session.router.js';

import indexViewRouter from './routers/views/index.router.js';
import productViewRouter from './routers/views/product.router.js';
import cartViewRouter from './routers/views/cart.router.js';
import realTimeProductsViewRouter from './routers/views/realTimeProducts.router.js';
import chatViewRouter from './routers/views/chat.router.js';

const app = express();

const SESSION_KEY = config.session_key;

app.use(expressSession({
    secret: SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {},
        ttl: 60,
    }),
}));

const COOKIE_SECRET = config.cookie_secret;

app.use(cookieParser(COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars');

initPassportConfig();

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexViewRouter, productViewRouter, cartViewRouter, realTimeProductsViewRouter, chatViewRouter);
app.use('/api', productApiRouter, cartApiRouter, sessionApiRouter);

app.use((error, req, res, next) => {
    if (error instanceof Exception) {
        console.log(error.message);
        res.status(error.status).json({ status: 'error', message: error.message });
    } else {
        const message = `Ha ocurrido un error desconocido: ${error.message}`;
        console.log(message);
        res.status(500).json({ status: 'error', message });
    }
});

export default app;