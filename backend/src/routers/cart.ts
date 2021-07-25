import { Router } from 'express';

import auth from './middlewares/auth';
import wrap from './utils/wrap';

import Controllers from '../controllers/index';
import { ItemRepository, UpdateCartCMD } from '../core/cart/repository';

const router = Router();

router.get('/:user_id', auth('client'), wrap(async req => {
    const user_id = req.params.user_id;
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length > 0) return carts[0];

    return await Controllers.cart.create({ user_id });
}));

router.delete('/:user_id', auth('client'), wrap(async req => {
    const user_id: string = req.params.user_id; 
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');

    const cart = carts[0];

    return await Controllers.cart.clear(cart.id);
}));

router.post('/:user_id/products', auth('client'), wrap(async req => {
    const user_id: string = req.params.user_id; 

    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');
    
    const cart = carts[0];

    const itemRepository: ItemRepository = req.body;

    return await Controllers.cart.setItem(cart.id, itemRepository);
}));

router.delete('/:user_id/products/:product_id', auth('client'), wrap(async req => {
    const user_id: string = req.params.user_id; 
    
    const carts = await Controllers.cart.search({ user_id });
    if (carts.length === 0) throw new Error('cart not found');
    
    const cart = carts[0];

    const product_id: string = req.params.product_id;

    return await Controllers.cart.remItem(cart.id, product_id);
}));

export default router;