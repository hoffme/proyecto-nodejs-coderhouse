import { Router } from 'express';

import passport from 'passport';

import Controllers from '../../controllers/index';

import { CreateUser } from '../../core/user/model';

import asyncHandler from './utils/wrap';

const router = Router();

router.post('/signin', passport.authenticate('local'), asyncHandler(async () => true));

router.post('/signup', asyncHandler(async (req) => {    
    const cmd: CreateUser = req.body;
    await Controllers.user.create(cmd);
    return true;
}))

router.post('/logout', asyncHandler(async (req) => {    
    req.logOut();
    return true;
}))

export default router;