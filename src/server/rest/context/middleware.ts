import { RequestHandler } from 'express';

import Context from '.';

const CTXMiddleware: RequestHandler = (req, res, next) => {
    Context.build(req)
        .then((ctx) => {
            req.ctx = ctx;
            next();
        })
        .catch((err) => {
            next(new Error('Internal Error'))
        })    
}

export default CTXMiddleware;