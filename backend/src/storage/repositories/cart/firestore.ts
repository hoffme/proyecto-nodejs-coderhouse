import { Cart, Item } from '../../../core/cart/model';
import CartRepository, { CartFilter, CreateCartCMD, SetItemCMD, UpdateCartCMD } from '../../../core/cart/repository';
import { Product } from '../../../core/product/model';

import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';
import uuid from '../../utils/uuid';

class ProductFirestoreRepository extends CartRepository {
    
    private readonly firestore: firestore.App;
    private readonly collectionName: string;

    constructor(firestore: firestore.App, collectionName: string, products: ProductRepository) {
        super(products);

        this.firestore = firestore;
        this.collectionName = collectionName;
    }

    private get collection(): firestore.Collection {
        return this.firestore.collection(this.collectionName);
    }

    async find(id: String): Promise<Cart> {
        const cart =  await this.collection.doc(id);
        if (!cart) throw new Error("cart not found");

        await this.hidratate_items(cart.item);

        return cart;
    }
    
    async search(filter: CartFilter): Promise<Cart[]> {
        const snapshots = 
            filter.user_id ? 
            await this.collection.where("user_id", "==", filter.user_id) :
            await this.collection.get();

        const carts: Cart[] = await snapshots.map(doc => doc.data());
    
        await this.hidratate_items(carts.reduce<Item[]>((result, cart) => {
            result.push(...(cart.items));
            return result;
        }, []));

        return carts;
    }

    async create(cmd: CreateCartCMD): Promise<Cart> {
        const cart: Cart = {
            id: uuid(),
            timestamp: new Date(),
            items: [],
            ...cmd
        }

        await this.collection.doc(cart.id).set(cart);

        await this.hidratate_items(cart.items);

        this.events.create.notify(cart);

        return cart;
    }

    async update(id: string, cmd: UpdateCartCMD): Promise<Cart> {
        const update = {
            ...(await this.find(id)),
            ...cmd
        }

        await this.collection.doc(id).set(update);

        await this.hidratate_items(update.items);

        this.events.update.notify(update);

        return update;
    }

    async delete(id: string): Promise<Cart> {
        const cart = await this.find(id);

        await this.collection.doc(id).delete();

        await this.hidratate_items(cart.items);

        this.events.delete.notify(cart);

        return cart;
    }

    async setItem(id: string, cmd: SetItemCMD): Promise<Item> {
        const cart = await this.find(id);

        const updateItem: Item = {
            product_id: cmd.product_id,
            count: cmd.count,
            product: undefined
        }

        cart.items.filter(item => item.product_id === item.product_id ? updateItem : item);

        this.collection.doc(cart.id).set(cart);

        await this.hidratate_item(updateItem);

        return updateItem;
    }
}

export default ProductFirestoreRepository;