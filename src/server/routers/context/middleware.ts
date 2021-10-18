import { RequestHandler } from 'express';

import Context from '.';

const CTXMiddleware: RequestHandler = (req, res, next) => {
    req.ctx = new Context();
    next();    
}

export default CTXMiddleware;