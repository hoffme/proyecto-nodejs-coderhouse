import { Cart, FilterCartCMD, AddressDTO } from '../../models/cart';

class CartController {

    async search(filter: FilterCartCMD): Promise<Cart[]> {
        return await Cart.search(filter);
    }

    async get(user_id: string): Promise<Cart> {
        const carts = await Cart.search({ user_id });
        if (carts.length > 0) return carts[0];

        return await Cart.create({
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
    
    async setItem(id: string, product_id: string, quantity: number): Promise<void> {
        const cart = await Cart.getById(id);
        await cart.setItem(product_id, quantity);
    }

    async setAddress(id: string, address: AddressDTO): Promise<void> {
        const cart = await Cart.getById(id);
        await cart.setAddress(address);
    }

    async clear(id: string): Promise<void> {
        const cart = await Cart.getById(id);
        await cart.clear();
    }

}

export default CartController;