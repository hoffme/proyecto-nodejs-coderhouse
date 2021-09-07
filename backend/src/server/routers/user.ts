import { Router } from 'express';
import multer from 'multer';

import auth from './middlewares/auth';
import asyncHandler from './utils/wrap';

import Controllers from '../../controllers';
import { UpdateUserCMD } from '../../core/user/repository';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, ((req.user?.id + '-') || '') + 'avatar-' + Date.now());
    }
})

const upload = multer({ storage });

router.get('/', auth('client'), asyncHandler(async req => {
    return req.user;
}))

router.put('/avatar', auth('client'), upload.single('avatar'), asyncHandler(async req => {
    const user_id = req.user?.id || '';

    if (!req.file) throw new Error('cannot upload avatar');

    const update = await Controllers.user.update(user_id, {
        avatar: `/static/images/${req.file.filename}`
    });

    return update;
}));

router.put('/', auth('client'), asyncHandler(async req => {
    const user_id = req.user?.id || '';
    const fields: UpdateUserCMD = req.body;

    const update = await Controllers.user.update(user_id, fields);

    return update;
}));

export default router;