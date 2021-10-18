import { RequestHandler } from 'express';
import errorResponse from '../utils/error';

const auth = (type: string): RequestHandler => {
    return (req, res, next) => {
        if (req.ctx.isAuthenticated(type)) return next();

        errorResponse(res, 'unauthorized', 401)
    }
}

export default auth;