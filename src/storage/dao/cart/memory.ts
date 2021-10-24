import { DAOMemorySettings } from '../../../models/storage/settings';

import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, UpdateCartCMD } from '../../../models/cart';

import uuid from "../../../utils/uuid";

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
    
    async delete(id: string): Promise<CartDTO> {
        const cart = await this.find(id);

        this.items = this.items.filter(item => item.id !== id);

        return cart;
    }
}


export default CartMemoryDAO;