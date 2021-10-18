import { Router } from 'express';
import multer from 'multer';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

import Controllers from '../../../controllers';

import { UpdateUserCMD } from '../../../models/user/model';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.ctx.user.id + '-avatar-' + Date.now());
    }
})

const upload = multer({ storage });

router.get('/', auth('client'), asyncHandler(async req => {
    const user = req.ctx.user;
    return user.json();
}))

router.put('/avatar', auth('client'), upload.single('avatar'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;

    if (!req.file) throw new Error('cannot upload avatar');

    const update = await Controllers.user.update(user_id, {
        avatar: `/images/${req.file.filename}`
    });

    return update;
}));

router.put('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const fields: UpdateUserCMD = req.body;

    const update = await Controllers.user.update(user_id, fields);

    return update;
}));

export default router;