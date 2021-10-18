import { Router } from 'express';

import ErrorsMiddleware from './middlewares/error';
import LoggerMiddleware from './middlewares/logger';

import AuthRouter from './endpoints/auth';
import UserRouter from './endpoints/user';
import ProductRouter from './endpoints/product';
import CartRouter from './endpoints/cart';

import asyncHandler from './utils/wrap';

const router = Router();

router.use(LoggerMiddleware);

router.get('/ping', asyncHandler(async () => 'pong'));

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/product', ProductRouter);
router.use('/cart', CartRouter);

router.use(ErrorsMiddleware);

export default router;