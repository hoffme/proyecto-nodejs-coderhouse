import { DAOMemorySettings } from '../../../models/storage/settings';

import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from '../../../models/cart/dao';

import uuid from "../../utils/uuid";

class CartMemoryDAO implements CartDAO {
    
    private items: CartDTO[];
    
    constructor(settings: DAOMemorySettings) {
        this.items = [];
    }
    
    async find(id: String): Promise<CartDTO> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('cart not found');

        return result;
    }
    
    async search(filter: FilterCartCMD): Promise<CartDTO[]> {
        return this.items.filter(item => {
            if (filter.user_id && filter.user_id !== item.user_id) return false;
            
            return true;
        })
    }
    
    async create(cmd: CreateCartCMD): Promise<CartDTO> {
        const cart: CartDTO = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd,
        }

        this.items.push(cart);

        return cart;
    }
    
    async update(id: string, cmd: UpdateCartCMD): Promise<CartDTO> {
        const cartUpdated = {
            ...(await this.find(id)),
            ...cmd
        }

        this.items = this.items.map(item => {
            return item.id === id ? cartUpdated : item
        })

        return cartUpdated;
    }

    async clear(id: string): Promise<CartDTO> {
        let result: CartDTO | undefined;
        
        this.items.forEach(cart => {
            if (cart.id !== id) return;

            cart.items_ref = [];
            result = cart;
        })
        if (!result) throw new Error('cart not found');

        return result;        
    }
    
    async setItem(id: string, item: ItemDTO): Promise<ItemDTO> {
        const cart = await this.find(id);
        
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

    async remItem(id: string, product_id: string): Promise<ItemDTO> {
        const cart = await this.find(id);

        let result: ItemDTO | undefined;
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


export default CartMemoryDAO;