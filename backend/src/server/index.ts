import { Server as HTTPServer } from 'http';

import { User as UserModel } from '../core/user/model';

import express from 'express';
import passport from 'passport';
import { urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import apiRouter from './routers/api';

import ServerSettings from './settings';

declare global {
    namespace Express {
        interface User extends UserModel {}
    }
}

class Server {

    private static settings: ServerSettings;

    private static server: HTTPServer;

    static async setup(settings: ServerSettings): Promise<void> {
        this.settings = settings;

        await this.httpServer();
    }

    private static async httpServer(): Promise<void> {
        const app = express();

        app.use(cookieParser());
        app.use(urlencoded({ extended: false }));
        app.use(session({
            secret: 'keyboard cat',       
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        app.use('/api', apiRouter);
        this.server = new HTTPServer(app);
    }

    static start() {
        this.server.listen(this.settings.port, () => {
            console.log(`Listening on http://localhost:${this.settings.port}`);
        });
    }
}

export default Server;