import { Router } from 'express';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

import Controllers from '../../../controllers/index';
import { ItemDTO } from '../../../models/cart/dao';

const router = Router();

router.get('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length > 0) return carts[0];

    return await Controllers.cart.create({ user_id });
}));

router.delete('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');

    const cart = carts[0];

    return await Controllers.cart.clear(cart.id);
}));

router.post('/products', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;

    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');
    
    const cart = carts[0];

    const itemDTA: ItemDTO = req.body;

    return await Controllers.cart.setItem(cart.id, itemDTA.product_id, itemDTA.count);
}));

router.delete('/products/:product_id', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');
    
    const cart = carts[0];

    const product_id: string = req.params.product_id;

    return await Controllers.cart.remItem(cart.id, product_id);
}));

router.post('/finish', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;

    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');
    
    const cart = carts[0];
    
    const cartFinished = await Controllers.cart.finish(cart.id);

    Controllers.notifier.orderCreated(req.ctx.user, cartFinished); // TODO

    return true;
}));

export default router;