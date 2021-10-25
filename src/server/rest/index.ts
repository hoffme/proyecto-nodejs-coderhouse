import express from 'express';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import { UserToken } from '../../controllers/auth';

import Context from './context';
import CTXMiddleware from './context/middleware';

import ErrorsMiddleware from './middlewares/error';
import LoggerMiddleware from './middlewares/logger';

import successResponse from './utils/success';

import AuthRouter from './endpoints/auth';
import UserRouter from './endpoints/user';
import ProductRouter from './endpoints/product';
import CartRouter from './endpoints/cart';
import MessageRouter from './endpoints/message';
import OrderRouter from './endpoints/order';
import SettingsRouter from './endpoints/settings';

import RestSettings from './settings';

declare global {
    namespace Express {
        interface Request {
            ctx: Context
        }
    }
}

declare module 'express-session' {
    interface SessionData {
        token?: UserToken
    }
}

const createRouter = async (settings: RestSettings) => {
    const app = express();

    app.use(cors());

    app.use('/', express.static('./public'));

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser(settings.session_secret));
    app.use(session({
        secret: settings.session_secret,
        resave: true,
        saveUninitialized: true,
    }));

    app.use(CTXMiddleware);
    app.use(LoggerMiddleware);

    app.get('/ping', (req, res, next) => successResponse(res, 'pong'));

    app.use('/auth', AuthRouter);
    app.use('/user', UserRouter);
    app.use('/product', ProductRouter);
    app.use('/cart', CartRouter);
    app.use('/chat', MessageRouter);
    app.use('/order', OrderRouter);
    app.use('/settings', SettingsRouter);

    app.use(ErrorsMiddleware);

    return app;
}

export default createRouter;