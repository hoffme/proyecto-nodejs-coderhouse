import { Router } from 'express';

import passport from 'passport';

import Controllers from '../../../controllers/index';

import { CreateUserCMD } from '../../../core/user/model';

import successResponse from '../responses/success';
import asyncHandler from '../utils/wrap';

const router = Router();

router.post('/signin', passport.authenticate('local', { failureFlash: true }), (req, res) => successResponse(res, true));

router.post('/signup', asyncHandler(async (req) => {    
    const cmd: CreateUserCMD = req.body;
    
    const user = await Controllers.user.create(cmd);
    Controllers.notifier.registerUser(user);

    return true;
}))

router.post('/logout', asyncHandler(async (req) => {    
    req.logOut();
    return true;
}))

export default router;