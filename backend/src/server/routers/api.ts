import { Router } from 'express';

import ErrorsMiddleware from './middlewares/error';
import LoggerMiddleware from './middlewares/logger';

import AuthRouter from './endpoints/auth';
import UserRouter from './endpoints/user';
import ProductRouter from './endpoints/product';
import CartRouter from './endpoints/cart';

import asyncHandler from './utils/wrap';

const router = Router();

// middleware

router.use(LoggerMiddleware);

// status point

router.get('/ping', asyncHandler(async () => 'pong'));

// adding routes

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/product', ProductRouter);
router.use('/cart', CartRouter);

// middleware errors

router.use(ErrorsMiddleware);

export default router;