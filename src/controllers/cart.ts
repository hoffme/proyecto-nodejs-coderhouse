import Storage from '../storage';

import Cart, { CreateCartCMD, FilterCartCMD, UpdateCartCMD } from '../models/cart/model';

class CartController {

    async find(id: string): Promise<Cart> {
        return await Storage.repositories.cart.find(id);
    }

    async search(filter: FilterCartCMD): Promise<Cart[]> {
        return await Storage.repositories.cart.search(filter);
    }

    async create(cmd: CreateCartCMD): Promise<Cart> {
        return await Storage.repositories.cart.create(cmd);
    }

    async update(id: string, update: UpdateCartCMD): Promise<Cart> {
        return await Storage.repositories.cart.update(id, update);
    }

    async finish(id: string): Promise<Cart> {
        const cart = await Storage.repositories.cart.find(id);

        // TODO: guardar en otra coleccion de ordenes

        return cart;
    }

    async clear(id: string): Promise<Cart> {
        return await Storage.repositories.cart.clear(id);
    }

    async setItem(cart_id: string, product_id: string, quantity: number): Promise<void> {
        const cart = await Storage.repositories.cart.find(cart_id);

        await cart.setItem(product_id, quantity);
    }

    async remItem(cart_id: string, product_id: string): Promise<void> {
        const cart = await Storage.repositories.cart.find(cart_id);

        await cart.remItem(product_id);
    }
}

export default CartController;