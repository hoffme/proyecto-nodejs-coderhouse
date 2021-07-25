import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';
import ProductRepository from '../../../core/product/repository';

import FileSettings from '../../settings/file';

import FileStorage from '../../utils/file';
import uuid from '../../utils/uuid';

class CartFileRepository extends CartRepository {
    
    private file: FileStorage<{[id: string]: CartRepositoryItem}>

    constructor(products: ProductRepository, setting: FileSettings) {
        super(products);

        this.file = new FileStorage(setting.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch (e) { await this.file.set({}) }
    }

    protected async _find(id: string): Promise<CartRepositoryItem> {
        const items = await this.file.get();

        const cart = items[id];
        if (!cart) throw new Error('cart not found');

        return cart;
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        const items = await this.file.get();

        return Object.values(items).filter(item => {
            if (filter.user_id && filter.user_id != item.user_id) return false; 
            
            return true;
        })
    }

    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const cart: CartRepositoryItem = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        }

        const items = await this.file.get();
        items[cart.id] = cart;

        await this.file.set(items);

        return cart;
    }

    protected async _update(id: string, update: UpdateCartCMD): Promise<CartRepositoryItem> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');
        
        items[id] = { ...(items[id]), ...update }
    
        await this.file.set(items);

        return items[id];
    }

    protected async _clear(id: string): Promise<CartRepositoryItem> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');

        items[id].items_ref = [];
        items[id].timestamp = new Date();
    
        await this.file.set(items);

        return items[id];
    }

    protected async _setItem(id: string, newItem: ItemRepository): Promise<ItemRepository> {
        const items = await this.file.get();
        const cart = items[id];
        if (!cart) throw new Error('cart not found');

        let added = false;
        cart.items_ref = cart.items_ref.map(item => {
            if (item.product_id !== item.product_id) return item;
            
            added = true;
            return newItem;
        })

        if (!added) cart.items_ref.push(newItem);

        await this.file.set(items);

        return newItem;
    }

    protected async _remItem(id: string, product_id: string): Promise<ItemRepository> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');
        
        let result: ItemRepository | undefined = undefined;

        items[id].items_ref = items[id].items_ref.filter(item => {
            if (item.product_id !== product_id) return true;
            
            result = item;
            return false;
        });

        if (!result) throw new Error('item not found');
    
        await this.file.set(items);

        return result;
    }
}

export default CartFileRepository;