import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from '../../../core/cart/dao';

import FirestoreSettings from '../../settings/firestore';

import uuid from '../../utils/uuid';

class CartFirestoreDAO implements CartDAO {
    
    private readonly settings: FirestoreSettings;
    private readonly collectionName: string;

    constructor(settings: FirestoreSettings) {        
        this.settings = settings;
        this.collectionName = 'carts';
    }

    private get collection() {
        return this.settings.firestore.collection(this.collectionName);
    }

    async find(id: string): Promise<CartDTO> {
        const cartRef = await this.collection.doc(id).get();
        if (!cartRef || !cartRef.exists) throw new Error('cart not found');

        const cartData = cartRef.data() || {};
        const cart: CartDTO = {
            id: cartRef.id,
            timestamp: cartData.timestamp,
            user_id: cartData.user_id,
            items_ref: cartData.items_ref
        }

        return cart;
    }

    async search(filter: FilterCartCMD): Promise<CartDTO[]> {
        let query = this.collection.where("id", "!=", null);

        if (filter.user_id) query = query.where("user_id", "==", filter.user_id)

        const snapshots = await query.get();

        return snapshots.docs.map(cartRef => {
            const cartData = cartRef.data();

            return {
                id: cartRef.id,
                timestamp: cartData.timestamp,
                user_id: cartData.user_id,
                items_ref: cartData.items_ref
            }
        })
    }

    async create(cmd: CreateCartCMD): Promise<CartDTO> {
        const cart: CartDTO = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        }

        await this.collection.doc(cart.id).set(cart);

        return cart;
    }

    async update(id: string, cmd: UpdateCartCMD): Promise<CartDTO> {
        const update: CartDTO = {
            ...(await this.find(id)),
            ...cmd
        }

        await this.collection.doc(id).set(update)

        return update;
    }

    async clear(id: string): Promise<CartDTO> {
        const update: CartDTO = {
            ...(await this.find(id)),
            items_ref: []
        }

        await this.collection.doc(id).set(update)

        return update;
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

        await this.collection.doc(cart.id).set(cart);

        return item;
    }

    async remItem(id: string, product_id: string): Promise<ItemDTO> {
        const cart = await this.find(id);

        let result: ItemDTO | undefined = undefined;
        cart.items_ref = cart.items_ref.filter(item => {
            if (item.product_id !== product_id) return true;
            
            result = item;
            return false;
        })

        if (!result) throw new Error('item not found');

        await this.collection.doc(cart.id).set(cart);

        return result;
    }
}

export default CartFirestoreDAO;