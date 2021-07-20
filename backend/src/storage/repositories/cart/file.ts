import { Cart, Item } from '../../../core/cart/model';
import CartRepository, { CartFilter, CreateCartCMD, SetItemCMD, UpdateCartCMD } from '../../../core/cart/repository';

import ProductRepository from '../../../core/product/repository';

import FileStorage from '../../connections/file';

import uuid from '../../utils/uuid';

class CartFileRepository extends CartRepository {

    private file: FileStorage<{[id: string]: Cart}>

    constructor(path: string, products: ProductRepository) {
        super(products);

        this.file = new FileStorage(path);
    }
    
    async setup() {
        try {
            await this.file.get();
        } catch (e) {
            await this.file.set({});
        }
    }

    async find(id: string): Promise<Cart> {
        const carts = await this.file.get();
        
        const cart = carts[id];
        if (!cart) throw new Error(`cart not found`);

        await this.hidratate_items(cart.items);
        
        return cart;
    }
    
    async search(filter: CartFilter): Promise<Cart[]> {
        const carts = await this.file.get();

        const result = Object.values(carts).filter(cart => {
            if (filter.user_id && cart.user_id !== filter.user_id) return false;

            return true;
        })

        await this.hidratate_items(result.reduce<Item[]>((result, cart) => {
            result.push(...(cart.items));
            return result;
        }, []));

        return result;
    }

    async create(cmd: CreateCartCMD): Promise<Cart> {
        const cart: Cart = {
            id: uuid(),
            timestamp: new Date(),
            items: [],
            ...cmd
        }

        const carts = await this.file.get();
        carts[cart.id] = cart;

        await this.file.set(carts);

        this.events.create.notify(cart);

        return cart;
    }

    async update(id: string, update: UpdateCartCMD): Promise<Cart> {
        const carts = await this.file.get();
        
        const cartUpdate = { ...(carts[id]), ...update };
        carts[id] = cartUpdate;

        await this.file.set(carts);

        await this.hidratate_items(cartUpdate.items);

        this.events.update.notify(cartUpdate)

        return cartUpdate;
    }

    async delete(id: string): Promise<Cart> {
        const carts = await this.file.get();

        const cart = carts[id];

        delete carts[id];

        await this.file.set(carts);

        await this.hidratate_items(cart.items);

        this.events.delete.notify(cart)

        return cart;
    }

    async setItem(cart_id: string, cmd: SetItemCMD): Promise<Item> {
        const carts = await this.file.get();

        const updateItem: Item = {
            product_id: cmd.product_id,
            count: cmd.count,
            product: undefined
        }

        carts[cart_id].items.filter(item => item.product_id === item.product_id ? updateItem : item);

        await this.file.set(carts);

        await this.hidratate_item(updateItem);

        return updateItem;
    }
}

export default CartFileRepository;