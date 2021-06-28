import { RequestHandler } from 'express';

const auth = (type: string): RequestHandler => {
    return (req, res, next) => {
        const role = req.query.role;
        if (role === type) return next();
        throw new Error('user not authorized');
    }
}

export default auth;