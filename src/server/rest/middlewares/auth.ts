import { RequestHandler } from 'express';

import { UserType } from '../../../models/user';

import errorResponse from '../utils/error';

const auth = (type?: UserType): RequestHandler => {
    return (req, res, next) => {
        if (req.ctx.isAuthenticated(type)) return next();

        errorResponse(res, 'user not authorized', 401)
    }
}

export default auth;