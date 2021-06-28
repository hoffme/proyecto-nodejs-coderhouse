import { NextFunction, Request, Response } from 'express';

import { Product } from '../core/product/model';
import EventCore from '../core/utils/events';

import successResponse from '../routers/responses/success';
import { Repository } from '../storage/repositories/repository';


class ProductsController {

    private repository: Repository<Product>

    public readonly events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    }

    constructor(repository: Repository<Product>) {
        this.repository = repository;

        this.events = {
            create: this.repository.events.create,
            update: this.repository.events.update,
            delete: this.repository.events.delete,
        }
    }

    // Methods

    async getAll() { return await this.repository.getAll() }

    async getById(id: string) { return await this.repository.getById(id) }

    async create(create: Product) { return await this.repository.create(create) }

    async update(update: Product) { return await this.repository.update(update.id, update) }

    async delete(id: string) { return await this.repository.delete(id) }

    // HTTP

    async getHTTP(req: Request, res: Response, next: NextFunction) {
        let result: Product[] | Product | undefined = undefined;

        const id = req.params.id;
        if (id && id.length > 0) {
            try { result = await this.getById(id) } 
            catch (e) {
                if (e.message !== "not found") throw e;
            }
        } else {
            result = await this.getAll();
        }
        
        successResponse(res, result);
    }

    async createHTTP(req: Request, res: Response, next: NextFunction) {
        const createParams = req.body;
        const product = await this.create(createParams);
        successResponse(res, product);
    }

    async updateHTTP(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const update = req.body;
        const productUpdated = await this.update({ id, ...update });
        successResponse(res, productUpdated);
    }

    async deleteHTTP(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const productDeleted = await this.delete(id);
        successResponse(res, productDeleted);
    }
}

export default ProductsController;