import EventCore from '../core/generics/events';

import { Cart, Item } from '../core/cart/model';
import CartRepository, {
    CartFilter,
    CreateCartCMD,
    ItemRepository,
    UpdateCartCMD
} from '../core/cart/repository';

class CartController {

    private repository: CartRepository

    public readonly events: {
        create: EventCore<Cart>
        update: EventCore<Cart>
        setItem: EventCore<{ cart_id: string, item: Item }>
    }

    constructor(repository: CartRepository) {
        this.repository = repository;

        this.events = {
            create: this.repository.events.create,
            update: this.repository.events.update,
            setItem: this.repository.events.setItem,
        }
    }

    async find(id: string): Promise<Cart> {
        return await this.repository.find(id);
    }

    async search(filter: CartFilter): Promise<Cart[]> {
        return await this.repository.search(filter);
    }

    async create(cmd: CreateCartCMD): Promise<Cart> {
        return await this.repository.create(cmd);
    }

    async update(id: string, update: UpdateCartCMD): Promise<Cart> {
        return await this.repository.update(id, update);
    }

    async clear(id: string): Promise<Cart> {
        return await this.repository.clear(id);
    }

    async setItem(cart_id: string, item: ItemRepository): Promise<Item> {
        return await this.repository.setItem(cart_id, item);
    }

    async remItem(cart_id: string, product_id: string): Promise<Item> {
        return await this.repository.remItem(cart_id, product_id);
    }
}

export default CartController;