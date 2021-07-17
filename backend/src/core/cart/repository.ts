import EventCore from "../generics/events";

import { 
    Cart,
    ProductCount,
} from "./model";

interface CartFilter {
}

interface CreateCartCMD {
}

interface UpdateCartCMD {
}

interface SetProductCMD {
    product_id: string
    count: number
}

interface CartRepository {
    events: {
        create: EventCore<Cart>
        update: EventCore<Cart>
        delete: EventCore<Cart>
    }

    find(id: String): Promise<Cart>
    search(filter: CartFilter): Promise<Cart[]>
    create(cmd: CreateCartCMD): Promise<Cart>
    update(id: string, cmd: UpdateCartCMD): Promise<Cart>
    delete(id: string): Cart

    setProduct(id: string, cmd: SetProductCMD): Promise<ProductCount>
}

export default CartRepository;