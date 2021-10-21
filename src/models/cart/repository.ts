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
    
}

export default CartRepository;
export type {
    FilterCartCMD,
    CreateCartCMD,
    UpdateCartCMD
}