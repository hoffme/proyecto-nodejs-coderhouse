import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from "../../../core/cart/repository";

import ProductRepository from "../../../core/product/repository";
import MemorySettings from "../../settings/memory";

import uuid from "../../utils/uuid";

class CartMemoryRepository extends CartRepository {
    
    private items: CartRepositoryItem[];
    
    constructor(products: ProductRepository, settings: MemorySettings) {
        super(products);

        this.items = [];
    }
    
    protected async _find(id: String): Promise<CartRepositoryItem> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('cart not found');

        return result;
    }
    
    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        return this.items.filter(item => {
            if (filter.user_id && filter.user_id !== item.user_id) return false;
            
            return true;
        })
    }
    
    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const cart: CartRepositoryItem = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd,
        }

        this.items.push(cart);

        return cart;
    }
    
    protected async _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem> {
        const cartUpdated = {
            ...(await this._find(id)),
            ...cmd
        }

        this.items = this.items.map(item => {
            return item.id === id ? cartUpdated : item
        })

        return cartUpdated;
    }

    protected async _clear(id: string): Promise<CartRepositoryItem> {
        let result: CartRepositoryItem | undefined;
        
        this.items.forEach(cart => {
            if (cart.id !== id) return;

            cart.items_ref = [];
            result = cart;
        })
        if (!result) throw new Error('cart not found');

        return result;        
    }
    
    protected async _setItem(id: string, item: ItemRepository): Promise<ItemRepository> {
        const cart = await this._find(id);
        
        let added = false;
        cart.items_ref = cart.items_ref.map(item => {
            if (item.product_id !== item.product_id) return item;
            
            added = true;
            return item;
        })

        if (!added) cart.items_ref.push(item);
        
        this.items = this.items.map(item => item.id === cart.id ? cart : item);

        return item;
    }

    protected async _remItem(id: string, product_id: string): Promise<ItemRepository> {
        const cart = await this._find(id);

        let result: ItemRepository | undefined;
        cart.items_ref = cart.items_ref.filter(item => {
            if (item.product_id !== product_id) return true;

            result = item;
            return false;
        })
        if (!result) throw new Error('product not found');

        this.items = this.items.map(item => item.id !== cart.id ? item : cart);

        return result;
    }
}


export default CartMemoryRepository;