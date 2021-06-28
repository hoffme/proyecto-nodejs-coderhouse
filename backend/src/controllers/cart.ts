import { NextFunction, Request, Response } from 'express';

import { Cart, ProductCount } from '../core/cart/model';
import EventCore from '../core/utils/events';

import successResponse from '../routers/responses/success';
import { Repository } from '../storage/repositories/repository';
import ProductsController from './product';


class CartController {

    private repository: Repository<Cart>

    public readonly events: {
        create: EventCore<Cart>
        update: EventCore<Cart>
        delete: EventCore<Cart>
    }

    private readonly products: ProductsController

    constructor(repository: Repository<Cart>, products: ProductsController) {
        this.repository = repository;

        this.events = {
            create: this.repository.events.create,
            update: this.repository.events.update,
            delete: this.repository.events.delete,
        }

        this.products = products;
    }

    // Methods

    async getAll() { return await this.repository.getAll() }

    async getById(id: string) { return await this.repository.getById(id) }

    async create(create: Cart) { return await this.repository.create(create) }

    async update(update: Cart) { return await this.repository.update(update.id, update) }

    async delete(id: string) { return await this.repository.delete(id) }

    // HTTP

    async getHTTP(req: Request, res: Response, next: NextFunction) {
        let result: Cart[] | Cart | undefined = undefined;

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
        let cart: Cart = { id: '', timestamp: new Date, products: [] };

        cart = await this.create(cart);

        successResponse(res, cart);
    }

    async addProductHTTP(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const productId = req.params.product;
        const countAdd = parseInt(req.params.count);
        
        const cart = await this.getById(id);
        const product = await this.products.getById(productId);

        const item = cart.products.find(p => p.product.id === product.id);
        if (item) {
            const count = item.count + countAdd;
            if (count > 0) {
                cart.products = cart.products.map(p => {
                    return p.product.id === product.id ? { product, count } : p;
                })
            } else {
                cart.products = cart.products.filter(p => p.product.id !== productId);
            }
        } else if (countAdd > 0) {
            cart.products = [...cart.products, { product, count: countAdd }];
        }

        const newCart = await this.update(cart);

        successResponse(res, newCart);
    }

    async removeProductHTTP(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const productId = req.params.product;
        const count = req.params.count;
        
        const cart = await this.getById(id);

        const product = cart.products.find(p => p.product.id === productId);
        if (!product) throw new Error('product not found');

        product.count = (count && count.length > 0) ? product.count - parseInt(count) : 0;

        if (product.count <= 0) {
            cart.products = cart.products.filter(p => p.product.id !== productId);
        } else {
            cart.products = cart.products.map(p => p.product.id === productId ? product : p)
        }

        const newCart = await this.update(cart);

        successResponse(res, newCart);
    }

    async deleteHTTP(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const cart = await this.delete(id);
        successResponse(res, cart);
    }
}

export default CartController;