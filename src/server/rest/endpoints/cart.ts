import { Router } from 'express';

import Controllers from '../../../controllers';
import { AddressDTO } from '../../../models/order';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

const router = Router();

router.get('/', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    return (await Controllers.cart.get(user_id)).json();
}));

router.post('/clear', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    
    const cart = await Controllers.cart.get(user_id);
    await cart.clear();

    return cart.json();
}));

router.post('/address', auth('client'), asyncHandler(async req => {
    const user_id = req.ctx.user.id;
    const address: AddressDTO = req.body;
    
    const cart = await Controllers.cart.get(user_id);
    await cart.setAddress(address);

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
    
    return (await cart.finish(user)).json();
}));

export default router;