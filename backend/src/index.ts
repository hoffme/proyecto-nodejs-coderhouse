import express from 'express';
import { Server } from 'http';

import Controllers from './controllers/index';
import apiRouter from './routers/api';

(async () => {
    // constants
    const PORT = process.env.PORT || 8080;

    // Setups controllers
    await Controllers.setup();

    // create app
    const app = express();
    const http = new Server(app);

    // public folder
    app.use(express.static('../public'));

    // api routes
    app.use('/api', apiRouter);

    // initialize server 
    http.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    })
})()