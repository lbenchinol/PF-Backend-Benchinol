import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import config from './config.js';
import { Exception, JWT_SECRET_KEY } from '../utils.js';
import UserController from '../controllers/user.controller.js';

const PORT = config.port;

const opts = {
    usernameField: 'email',
    passReqToCallback: true,
};

const githubOpts = {
    clientID: config.gh_client_id,
    clientSecret: config.gh_client_secret,
    callbackURL: `http://localhost:${PORT}/api/session/github/callback`
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
}

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: JWT_SECRET_KEY
};


export const init = () => {
    passport.use('register', new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const user = await UserController.get(email);
            if (user) {
                return done(new Exception(`Usuario ya registrado`, 400));
            }
            const newUser = await UserController.create(req.body);
            done(null, newUser);
        } catch (error) {
            done(new Exception(`Ocurrió un error durante el registro`, 400));
        }
    }));

    passport.use('local', new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const user = await UserController.authenticate(email, password);
            if (user) {
                done(null, user);
            }
        } catch (error) {
            done(new Exception(`Ocurrió un error durante la autenticación`, 400));
        }
    }));

    passport.use('github', new GitHubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email;
            let userFinded = await UserController.get(email);
            if (userFinded) {
                return done(null, userFinded);
            } else {
                const user = {
                    first_name: profile._json.name,
                    last_name: '',
                    email,
                    age: '',
                    password: '',
                    provider: 'Github',
                };
                const newUser = await UserController.create(user);
                done(null, newUser);
            }
        } catch (error) {
            done(new Exception(`Ocurrió un error durante la autenticación`, 400));
        }
    }));

    passport.use('jwt', new JWTStrategy(jwtOpts, async (payload, done) => {
        return done(null, payload);
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (uid, done) => {
        try {
            const user = await UserController.getById(uid);
            done(null, user);
        } catch (error) {
            done(new Exception(`Ocurrió un error durante la deserialización`, 400));
        }

    });
}