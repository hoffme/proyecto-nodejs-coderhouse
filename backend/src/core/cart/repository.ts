import Cart, { CreateCartCMD, FilterCartCMD, UpdateCartCMD } from "./model";

class CartRepository {
    
    public async find(id: string): Promise<Cart> {
        return Cart.getById(id);
    }

    public async search(filter: FilterCartCMD): Promise<Cart[]> {
        return Cart.search(filter);
    }

    public async create(fields: CreateCartCMD): Promise<Cart> {
        return Cart.create(fields);
    }

    public async update(id: string, cmd: UpdateCartCMD): Promise<Cart> {
        const cart = await Cart.getById(id);
        await cart.update(cmd);
        return cart;
    }

    public async clear(id: string): Promise<Cart> {
        const cart = await Cart.getById(id);
        await cart.clear();
        return cart;
    }
}

export default CartRepository;
export type {
    FilterCartCMD,
    CreateCartCMD,
    UpdateCartCMD
}