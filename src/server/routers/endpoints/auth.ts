import { Router } from 'express';

import Controllers from '../../../controllers/index';
import { SignInParams, SignUpParams } from '../../../controllers/auth';

import asyncHandler from '../utils/wrap';

const router = Router();

router.post('/signin', asyncHandler(async (req) => {    
    const params: SignInParams = req.body;
    const token = await Controllers.auth.signin(params);
    return token;
}));

router.post('/signup', asyncHandler(async (req) => {
    const params: SignUpParams = req.body;
    const token = await Controllers.auth.signup(params);
    return token;
}))

router.post('/logout', asyncHandler(async (req) => {
    return await Controllers.auth.logout(req.ctx.token);
}))

export default router;