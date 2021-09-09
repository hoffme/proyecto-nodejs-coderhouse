import express from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as PassportLocal } from 'passport-local';

import { UserModel } from '../../core/user/model';

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
            .catch(err => done(err, null, err))
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

    app.use(cors());

    app.use('/', express.static('./public'));

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser(settings.session_secret));
    app.use(session({
        secret: settings.session_secret,
        resave: false,
        saveUninitialized: false,
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/api', apiRouter);

    return app;
}

export default createRouter;