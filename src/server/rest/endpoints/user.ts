import { Router } from 'express';

import { UpdateUser } from '../../../models/user';

import Controllers from '../../../controllers';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

const router = Router();

router.get('/', auth(), asyncHandler(async req => {
    const user = req.ctx.user;
    return user.json();
}))

router.put('/', auth(), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const fields: UpdateUser = req.body;

    const update = await Controllers.user.update(user_id, fields);

    return update;
}));

export default router;