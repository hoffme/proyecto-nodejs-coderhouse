import { RequestHandler } from 'express';

const auth = (type: string): RequestHandler => {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        throw new Error('user not authorized');
    }
}

export default auth;