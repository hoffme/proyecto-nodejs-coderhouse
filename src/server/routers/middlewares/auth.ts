import { RequestHandler } from 'express';

const auth = (type: string): RequestHandler => {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();

        res.status(401).send();
    }
}

export default auth;