import { json, Router, urlencoded } from 'express';

import ErrorsMiddleware from './middlewares/error';
import LoggerMiddleware from './middlewares/logger';

import ProductRouter from './product';
import CartRouter from './cart';
import AuthRouter from './auth';

import wrap from './utils/wrap';

const router = Router();

// middleware

router.use(LoggerMiddleware);
router.use(json());
router.use(urlencoded({ extended: true }));

// status point

router.get('/ping', wrap(async () => 'pong'));

// adding routes

router.use('/product', ProductRouter);
router.use('/cart', CartRouter);
router.use('/auth', AuthRouter);

// middleware errors

router.use(ErrorsMiddleware);

export default router;