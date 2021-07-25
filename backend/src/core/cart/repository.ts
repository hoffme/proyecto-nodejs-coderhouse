import EventCore from "../generics/events";
import { Product } from "../product/model";
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

interface CartRepositoryItem {
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
        clear: EventCore<Cart>
        setItem: EventCore<{ cart_id: string, item: Item }>
        remItem: EventCore<{ cart_id: string, item: Item }>
    }

    protected constructor(products: ProductRepository) {
        this.products = products;
        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            clear: new EventCore('clear'),
            setItem: new EventCore('set-item'),
            remItem: new EventCore('rem-item')
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

    private async decode_cart(cart: CartRepositoryItem): Promise<Cart> {
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

    private async decode_carts(carts: CartRepositoryItem[]): Promise<Cart[]> {
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
    
    private async decode_item(item: ItemRepository, product?: Product): Promise<Item> {
        if (!product) product = await this.products.find(item.product_id);        
        
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
        const cart = await this.decode_cart(cart_rep);
    
        this.events.create.notify(cart);

        return cart;
    }

    async update(id: string, update: UpdateCartCMD): Promise<Cart> {
        const cart_rep = await this._update(id, update);
        const cart = await this.decode_cart(cart_rep);
    
        this.events.update.notify(cart);
    
        return cart;
    }

    async clear(id: string): Promise<Cart> {
        const cart_rep = await this._clear(id);
        const cart = await this.decode_cart(cart_rep);
    
        this.events.clear.notify(cart);
    
        return cart;
    }

    async setItem(cart_id: string, item: ItemRepository): Promise<Item> {
        const product = await this.products.find(item.product_id);

        const item_rep = await this._setItem(cart_id, item);
        const item_ext = await this.decode_item(item_rep, product);
    
        this.events.setItem.notify({ cart_id, item: item_ext });

        return item_ext;
    }

    async remItem(cart_id: string, product_id: string): Promise<Item> {
        const product = await this.products.find(product_id);

        const item_rep = await this._remItem(cart_id, product_id);
        const item_ext = await this.decode_item(item_rep, product);
    
        this.events.remItem.notify({ cart_id, item: item_ext });

        return item_ext;
    }

    async setup(): Promise<void> {}

    protected abstract _find(id: String): Promise<CartRepositoryItem>
    protected abstract _search(filter: CartFilter): Promise<CartRepositoryItem[]>

    protected abstract _create(cmd: CreateCartCMD): Promise<CartRepositoryItem>
    protected abstract _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem>
    protected abstract _clear(id: string): Promise<CartRepositoryItem>
    
    protected abstract _setItem(id: string, item: ItemRepository): Promise<ItemRepository>
    protected abstract _remItem(id: string, product_id: string): Promise<ItemRepository>
}

export default CartRepository;
export type {
    CartFilter,
    CreateCartCMD,
    UpdateCartCMD,
    CartRepositoryItem,
    ItemRepository
}