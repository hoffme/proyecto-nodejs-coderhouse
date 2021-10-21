import Storage from '../storage';

import Cart, { FilterCartCMD } from '../models/cart/model';
import { AddressDTO } from '../models/cart/dao';

class CartController {

    async search(filter: FilterCartCMD): Promise<Cart[]> {
        return await Storage.repositories.cart.search(filter);
    }

    async get(user_id: string): Promise<Cart> {
        const carts = await Storage.repositories.cart.search({ user_id });
        if (carts.length > 0) return carts[0];

        return await Storage.repositories.cart.create({
            user_id,
            items_ref: [],
            address: {
                city: '',
                zip_code: '',
                street: '',
                number: '',
                indications: ''
            },
            total: 0
        });
    }

    async finish(id: string) {
        const cart = await Storage.repositories.cart.find(id);
        return cart.finish();
    }

    async setItem(id: string, product_id: string, quantity: number): Promise<void> {
        const cart = await Storage.repositories.cart.find(id);
        await cart.setItem(product_id, quantity);
    }

    async setAddress(id: string, address: AddressDTO): Promise<void> {
        const cart = await Storage.repositories.cart.find(id);
        await cart.setAddress(address);
    }

    async clear(id: string): Promise<void> {
        const cart = await Storage.repositories.cart.find(id);
        await cart.clear();
    }

}

export default CartController;