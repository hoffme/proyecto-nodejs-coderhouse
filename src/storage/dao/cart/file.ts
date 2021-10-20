import { DAOFileSettings } from '../../../models/storage/settings';

import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from '../../../models/cart/dao';

import FileStorage from '../../../utils/file';
import uuid from '../../../utils/uuid';

class CartFileDAO implements CartDAO {
    
    private file: FileStorage<{[id: string]: CartDTO}>

    constructor(setting: DAOFileSettings) {
        this.file = new FileStorage(setting.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch (e) { await this.file.set({}) }
    }

    async find(id: string): Promise<CartDTO> {
        const items = await this.file.get();

        const cart = items[id];
        if (!cart) throw new Error('cart not found');

        return cart;
    }

    async search(filter: FilterCartCMD): Promise<CartDTO[]> {
        const items = await this.file.get();

        return Object.values(items).filter(item => {
            if (filter.user_id && filter.user_id != item.user_id) return false; 
            
            return true;
        })
    }

    async create(cmd: CreateCartCMD): Promise<CartDTO> {
        const cart: CartDTO = {
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

    async update(id: string, update: UpdateCartCMD): Promise<CartDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');
        
        items[id] = { ...(items[id]), ...update }
    
        await this.file.set(items);

        return items[id];
    }

    async clear(id: string): Promise<CartDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');

        items[id].items_ref = [];
        items[id].timestamp = new Date();
    
        await this.file.set(items);

        return items[id];
    }

    async setItem(id: string, newItem: ItemDTO): Promise<ItemDTO> {
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

    async remItem(id: string, product_id: string): Promise<ItemDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');
        
        let result: ItemDTO | undefined = undefined;

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

export default CartFileDAO;