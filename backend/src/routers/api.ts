import { Router } from 'express';

import ErrorsMiddleware from './middlewares/error';

import ProductRouter from './product';
import CartRouter from './cart';

const router = Router();

// adding routes

router.use('/products', ProductRouter);
router.use('/cart', CartRouter);

// middleware errors

router.use(ErrorsMiddleware);

export default router;