import firebase from 'firebase';

import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';
import ProductRepository from '../../../core/product/repository';

import uuid from '../../utils/uuid';

class CartFirestoreRepository extends CartRepository {
    
    private readonly firestore: firebase.firestore.Firestore;
    private readonly collectionName: string;

    constructor(products: ProductRepository, firestore: firebase.firestore.Firestore) {
        super(products);
        
        this.firestore = firestore;
        this.collectionName = 'carts';
    }

    private get collection(): firebase.firestore.CollectionReference {
        return this.firestore.collection(this.collectionName);
    }

    protected async _find(id: string): Promise<CartRepositoryItem> {
        const cartRef = await this.collection.doc(id).get();
        if (!cartRef || !cartRef.exists) throw new Error('cart not found');

        const cartData = cartRef.data() || {};
        const cart: CartRepositoryItem = {
            id: cartRef.id,
            timestamp: cartData.timestamp,
            user_id: cartData.user_id,
            items_ref: cartData.items_ref
        }

        return cart;
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
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

    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const cart: CartRepositoryItem = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        }

        await this.collection.doc(cart.id).set(cart);

        return cart;
    }

    protected async _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem> {
        const update: CartRepositoryItem = {
            ...(await this._find(id)),
            ...cmd
        }

        await this.collection.doc(id).set(update)

        return update;
    }

    protected async _clear(id: string): Promise<CartRepositoryItem> {
        const update: CartRepositoryItem = {
            ...(await this._find(id)),
            items_ref: []
        }

        await this.collection.doc(id).set(update)

        return update;
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

        await this.collection.doc(cart.id).set(cart);

        return item;
    }

    protected async _remItem(id: string, product_id: string): Promise<ItemRepository> {
        const cart = await this._find(id);

        let result: ItemRepository | undefined = undefined;
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

export default CartFirestoreRepository;