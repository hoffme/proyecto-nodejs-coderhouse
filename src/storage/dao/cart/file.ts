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

    async delete(id: string): Promise<CartDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('cart not found');
        
        const model = items[id];
        delete items[id];

        await this.file.set(items);

        return model;
    }
}

export default CartFileDAO;