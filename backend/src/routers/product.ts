import { Router } from 'express';

import auth from './middlewares/auth';

import Controllers from '../controllers/index';

const router = Router();

router.get('/list/:id?', (...p) => Controllers.products.getHTTP(...p));
router.post('/create', auth("admin"), (...p) => Controllers.products.createHTTP(...p));
router.put('/update/:id', auth("admin"), (...p) => Controllers.products.updateHTTP(...p));
router.delete('/delete/:id', auth("admin"), (...p) => Controllers.products.deleteHTTP(...p));

export default router;