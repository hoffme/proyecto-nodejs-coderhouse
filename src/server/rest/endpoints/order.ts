import { Router } from 'express';

import { Order, OrderState } from '../../../models/order';

import Controllers from '../../../controllers/index';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

const router = Router();

router.get('/', auth(), asyncHandler(async req => {
    const user = req.ctx.user;
    
    let orders: Order[]

    if (user.type === 'admin') {
        orders = await Controllers.order.search({});
    } else {
        orders = await Controllers.order.search({ user_id: user.id });
    }

    return orders.map(order => order.json());
}));

router.get('/:id', auth(), asyncHandler(async req => {
    const order_id: string = req.params.id;
    const user = req.ctx.user;

    const order = await Controllers.order.get(order_id);
    
    if (user.type !== 'admin' && user.id !== order.user.id) {
        return null;
    }

    return order.json();
}));

router.put('/:id/state/:state', auth('admin'), asyncHandler(async req => {
    const order_id: string = req.params.id;
    const order_state: OrderState = Order.validateState(req.params.state);
    
    const order = await Controllers.order.get(order_id);

    order.setState(order_state);

    return order.json();
}))

export default router;