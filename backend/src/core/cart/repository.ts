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

interface ItemRepository {
    product_id: string
    count: number
}

interface CartRepository {
    id: string
    user_id: string
    timestamp: Date
    items_ref: ItemRepository[]
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

    protected async hidratate_items(items: ItemRepository[]): Promise<Item[]> {
        const products_array = await this.products.search({
            ids: items.map(item => item.product_id)
        })
        const products_map = Object.fromEntries(products_array.map(product => {
            return [product.id, product];
        }));

        return items.map(item => {
            return {
                count: item.count,
                product: products_map[item.product_id]
            }
        })
    }

    private async decode_cart(cart: CartRepository): Promise<Cart> {
        const products_array = await this.products.search({
            ids: cart.items_ref.map(item => item.product_id)
        })
        const products_map = Object.fromEntries(products_array.map(product => {
            return [product.id, product];
        }));

        const result: Cart = {
            id: cart.id,
            user_id: cart.user_id,
            timestamp: cart.timestamp,
            items: cart.items_ref.map(item => ({
                count: item.count,
                product: products_map[item.product_id]
            }))
        }

        return result;
    }

    private async decode_carts(carts: CartRepository[]): Promise<Cart[]> {
        const ids = carts.reduce<string[]>((result, cart) => {
            result.push(...cart.items_ref.map(item => item.product_id));
            return result;
        }, [])

        const products_array = await this.products.search({ids});
        const products_map = Object.fromEntries(products_array.map(product => {
            return [product.id, product];
        }));

        const result: Cart[] = carts.map(cartRef => {
            return {
                id: cartRef.id,
                user_id: cartRef.user_id,
                timestamp: cartRef.timestamp,
                items: cartRef.items_ref.map(item => ({
                    count: item.count,
                    product: products_map[item.product_id]
                }))
            }
        })

        return result;
    }
    
    private async decode_item(item: ItemRepository): Promise<Item> {
        const product = await this.products.find(item.product_id);
        return { count: item.count, product };
    }

    async find(id: string): Promise<Cart> {
        const cart_rep = await this._find(id);
        return await this.decode_cart(cart_rep);
    }
    
    async search(filter: CartFilter): Promise<Cart[]> {
        const cart_rep = await this._search(filter);
        return await this.decode_carts(cart_rep);
    }

    async create(cmd: CreateCartCMD): Promise<Cart> {
        const cart_rep = await this._create(cmd);
        return await this.decode_cart(cart_rep);
    }

    async update(id: string, update: UpdateCartCMD): Promise<Cart> {
        const cart_rep = await this._update(id, update);
        return await this.decode_cart(cart_rep);
    }

    async setItem(cart_id: string, item: ItemRepository): Promise<Item> {
        const item_rep = await this._setItem(cart_id, item);
        return await this.decode_item(item_rep);
    }

    async setup(): Promise<void> {}

    protected abstract _find(id: String): Promise<CartRepository>
    protected abstract _search(filter: CartFilter): Promise<CartRepository[]>

    protected abstract _create(cmd: CreateCartCMD): Promise<CartRepository>
    protected abstract _update(id: string, cmd: UpdateCartCMD): Promise<CartRepository>
    
    protected abstract _setItem(id: string, item: ItemRepository): Promise<ItemRepository>
}

export default CartRepository;
export type {
    CartFilter,
    CreateCartCMD,
    UpdateCartCMD,
    ItemRepository
}