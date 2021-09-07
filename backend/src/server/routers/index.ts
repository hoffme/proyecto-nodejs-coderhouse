import express, { json } from 'express';
import { urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as PassportLocal } from 'passport-local';

import { User as UserModel } from '../../core/user/model';

import Controllers from '../../controllers/index';

import RouterSettings from './settings';
import apiRouter from './api';

declare global {
    namespace Express {
        interface User extends UserModel {}
    }
}

passport.use(new PassportLocal(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (username, password, done) => {
        Controllers.user.verify(username, password)
            .then(user => done(null, user))
            .catch(err => done(err, null))
    }
));

passport.serializeUser((user, done) => { done(null, user.id) });

passport.deserializeUser((id: string, done) => {
    Controllers.user.find({ id })
        .then(user => {
            if(!user) done(new Error('user not found'), null);
            done(null, user);   
        })
        .catch(err => done(err, null))
});

const createRouter = async (settings: RouterSettings) => {
    const app = express();

    app.use('/static', express.static('./public'));

    app.use(json());
    app.use(urlencoded({ extended: false }));
    app.use(cookieParser(settings.session_secret));
    app.use(session({
        secret: settings.session_secret,       
        resave: true,
        saveUninitialized: true
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', apiRouter);

    return app;
}

export default createRouter;