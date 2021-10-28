import { Router } from 'express';

import { CreateProductCMD, FilterProductCMD, UpdateProductCMD } from '../../../models/product';

import Controllers from '../../../controllers';

import auth from '../middlewares/auth';
import asyncHandler from '../utils/wrap';

const router = Router();

router.get('/:id', asyncHandler(async req => {
    const id = req.params.id;
    const result = await Controllers.products.find(id);
    return result.json();
}));

router.post('/search', asyncHandler(async req => {
    const filter: FilterProductCMD = req.body;

    const result = await Controllers.products.search(filter);

    return result.map(product => product.json());
}));

router.post('/', auth("admin"), asyncHandler(async req => {
    const cmd: CreateProductCMD = req.body;
    
    const result = await Controllers.products.create(cmd);

    return result.json();
}));

router.put('/:id', auth("admin"), asyncHandler(async req => {
    const id: string = req.params.id; 
    const cmd: UpdateProductCMD = req.body;

    const result = await Controllers.products.update(id, cmd);

    return result.json();
}));

router.delete('/:id', auth("admin"), asyncHandler(async req => {
    const id: string = req.params.id;

    const result = await Controllers.products.delete(id);

    return result.json();
}));

export default router;