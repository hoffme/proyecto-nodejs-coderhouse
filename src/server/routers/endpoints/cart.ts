import { Router } from 'express';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

import Controllers from '../../../controllers/index';

const router = Router();

router.get('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    return await Controllers.cart.get(user_id);
}));

router.post('/clear', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    const cart = await Controllers.cart.get(user_id);
    await cart.clear();

    return cart.json();
}));

router.post('/products', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const itemDTA: { product_id: string, quantity: number } = req.body;

    const cart = await Controllers.cart.get(user_id);
    await cart.setItem(itemDTA.product_id, itemDTA.quantity)

    return cart.json();
}));

router.delete('/products/:product_id', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const product_id: string = req.params.product_id;
    
    const cart = await Controllers.cart.get(user_id);
    await cart.setItem(product_id, 0);

    return cart.json();
}));

router.post('/finish', auth('client'), asyncHandler(async req => {
    const user = req.ctx.user;

    const cart = await Controllers.cart.get(user.id);
    
    return cart.finish(user);
}));

export default router;