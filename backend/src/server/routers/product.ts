import { Router } from 'express';

import auth from './middlewares/auth';
import wrap from './utils/wrap';

import Controllers from '../../controllers';
import { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../core/product/repository';

const router = Router();

router.get('/:id', wrap(async req => {
    const id = req.params.id;
    return await Controllers.products.find(id);
}));

router.post('/search', wrap(async req => {
    const filter: FilterProduct = req.body;

    return Controllers.products.search(filter);
}));

router.post('/', auth("admin"), wrap(async req => {
    const cmd: CreateProductCMD = req.body;
    
    return await Controllers.products.create(cmd);
}));

router.put('/:id', auth("admin"), wrap(async req => {
    const id: string = req.params.id; 
    const cmd: UpdateProductCMD = req.body;

    return await Controllers.products.update(id, cmd);
}));

router.delete('/:id', auth("admin"), wrap(async req => {
    const id: string = req.params.id;

    return await Controllers.products.delete(id);
}));

export default router;