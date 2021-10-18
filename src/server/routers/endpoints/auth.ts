import { Router } from 'express';

import Controllers from '../../../controllers/index';

import { CreateUserCMD } from '../../../models/user/model';

import asyncHandler from '../utils/wrap';

const router = Router();

router.post('/signin', asyncHandler(async (req) => {    
    const cmd: { email: string, password: string } = req.body;
    
    const user = await Controllers.user.verify(cmd.email, cmd.password);

    return user;
}));

router.post('/signup', asyncHandler(async (req) => {    
    const cmd: CreateUserCMD = req.body;
    
    const user = await Controllers.user.create(cmd);
    Controllers.notifier.registerUser(user);

    return true;
}))

router.post('/logout', asyncHandler(async (req) => {
    req.logOut();
}))

export default router;