import express from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import * as UserModel from '../../models/user/model';

import RouterSettings from './settings';

import router from './api';

declare global {
    namespace Express {
        interface User extends UserModel.default {}
    }
}
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

    app.use('/api', router);

    return app;
}

export default createRouter;