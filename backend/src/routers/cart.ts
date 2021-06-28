import { Router } from 'express';

import Controllers from '../controllers/index';

const router = Router();

router.get('/list/:id?', (...p) => Controllers.cart.getHTTP(...p));
router.post('/', (...p) => Controllers.cart.createHTTP(...p));
router.put('/:id/add/:product/count/:count', (...p) => Controllers.cart.addProductHTTP(...p));
router.put('/:id/remove/:product/count/:count?', (...p) => Controllers.cart.removeProductHTTP(...p));
router.put('/:id/remove/:product', (...p) => Controllers.cart.removeProductHTTP(...p));
router.delete('/:id', (...p) => Controllers.cart.deleteHTTP(...p));

export default router;