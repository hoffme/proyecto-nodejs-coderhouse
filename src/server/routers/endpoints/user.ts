import { Router } from 'express';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

import Controllers from '../../../controllers';

import { UpdateUserCMD } from '../../../models/user/model';

const router = Router();

router.get('/', auth('client'), asyncHandler(async req => {
    const user = req.ctx.user;
    return user.json();
}))

router.put('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const fields: UpdateUserCMD = req.body;

    const update = await Controllers.user.update(user_id, fields);

    return update;
}));

export default router;