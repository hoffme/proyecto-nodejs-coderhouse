import EventCore from "../generics/events";
import ProductRepository from "../product/repository";

import { 
    Cart,
    Item,
} from "./model";

interface CartFilter {
    user_id?: string
}

interface CreateCartCMD {
    user_id: string
}

interface UpdateCartCMD {
    user_id?: string
}

interface SetItemCMD {
    product_id: string
    count: number
}

abstract class CartRepository {
    
    private readonly products: ProductRepository;
    public readonly events: {
        create: EventCore<Cart>
        update: EventCore<Cart>
        delete: EventCore<Cart>
    }

    protected constructor(products: ProductRepository) {
        this.products = products;
        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            delete: new EventCore('delete')
        }
    }

    protected async hidratate_item(item: Item) {
        item.product = await this.products.find(item.product_id);
    }

    protected async hidratate_items(items: Item[]) {
        const products_array = await this.products.search({
            ids: items.map(item => item.product_id)
        })
        const products_map = Object.fromEntries(products_array.map(product => {
            return [product.id, product];
        }));

        items.forEach(item => {
            item.product = products_map[item.product_id];
        })
    }

    abstract find(id: String): Promise<Cart>
    abstract search(filter: CartFilter): Promise<Cart[]>

    abstract create(cmd: CreateCartCMD): Promise<Cart>
    abstract update(id: string, cmd: UpdateCartCMD): Promise<Cart>
    
    abstract setItem(id: string, cmd: SetItemCMD): Promise<Item>
}

export default CartRepository;
export type {
    CartFilter,
    CreateCartCMD,
    UpdateCartCMD,
    SetItemCMD
}