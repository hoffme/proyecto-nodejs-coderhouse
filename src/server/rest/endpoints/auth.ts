import { Router } from 'express';

import { SignInParams, SignUpParams } from '../../../controllers/auth';
import Controllers from '../../../controllers';

import asyncHandler from '../utils/wrap';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', asyncHandler(async (req) => {    
    const params: SignInParams = req.body;
    
    const token = await Controllers.auth.signin(params);
    req.session.token = token;
    
    return token;
}));

router.post('/signup', asyncHandler(async (req) => {
    const params: SignUpParams = req.body;
    
    await Controllers.auth.signup(params);
    
    const token = await Controllers.auth.signin({
        email: params.email,
        password: params.password
    });
    req.session.token = token;
    
    return token;
}))

router.post('/logout', auth(), asyncHandler(async (req) => {
    await Controllers.auth.logout(req.ctx.token);
    
    req.session.destroy(() => {});
    
    return true;
}))

export default router;