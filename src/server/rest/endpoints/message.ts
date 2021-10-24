import { Router } from 'express';

import Controllers from '../../../controllers/index';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

const router = Router();

router.get('/', auth(), asyncHandler(async req => {
    const user = req.ctx.user;

    const messages = await Controllers.message.search({ user_id: user.id });

    return messages.map(message => message.json())
}));

router.post('/', auth('client'), asyncHandler(async req => {
    const user = req.ctx.user;
    const params: { body: string } = req.body;

    const message = await Controllers.message.createClient(user, params.body);

    return message.json();
}))

router.post('/:chat_id', auth('admin'), asyncHandler(async req => {
    const user = req.ctx.user;
    const chat_id: string = req.params.chat_id;
    const params: { body: string } = req.body;

    const message = await Controllers.message.createSeller(user, chat_id, params.body);

    return message.json();
}))

export default router;