import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

import config from './config/config.js';

export const JWT_SECRET_KEY = config.jwt_key;

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (passwordFlat, passwordEncrypted) => bcrypt.compareSync(passwordFlat, passwordEncrypted);

export const tokenGenerator = (user) => {
    const { _id: id, first_name, last_name, email, role } = user;
    const payload = { id, first_name, last_name, email, role };
    return JWT.sign(payload, JWT_SECRET_KEY, { expiresIn: '1m' });
};

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                return reject(error);
            }
            resolve(payload);
        });
    });
};

export const authenticationMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, payload, info) {
        if (error) {
            return next(error);
        }
        if (!payload) {
            return res.status(401).json({ message: info.message ? info.message : info.toString() });
        }
        req.user = payload;
        next();
    })(req, res, next);
};

export const authorizationMiddleware = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { role: userRole } = req.user;
    if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'No premissions' });
    }
    next();
}

//  -----       EXCEPTIONS ERRORS       -----

export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

export class BadRequestException extends Exception {
    constructor(message) {
        super(message, 400);
    }
};

export class NotFoundException extends Exception {
    constructor(message) {
        super(message, 404);
    }
};