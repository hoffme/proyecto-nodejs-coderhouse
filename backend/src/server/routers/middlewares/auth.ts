import { RequestHandler } from 'express';

const auth = (type: string): RequestHandler => {
    return (req, res, next) => {
        if (req.user) return next();
        throw new Error('user not authorized');
    }
}

export default auth;