import mongoose, { CallbackError, Schema } from 'mongoose';

import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';
import ProductRepository from '../../../core/product/repository';

import MongooseConnection from '../../connections/mongoose';
import uuid from '../../utils/uuid';

class CartMongooseRepository extends CartRepository {
    
    private readonly connection: MongooseConnection;
    private readonly collectionName: string;

    private readonly collection: mongoose.Model<CartRepositoryItem>;

    private readonly itemSchema: Schema<ItemRepository>;
    private readonly schema: Schema<CartRepositoryItem>;

    constructor(products: ProductRepository, connection: MongooseConnection) {
        super(products);

        this.connection = connection;
        this.collectionName = 'carts';

        this.itemSchema = new Schema<ItemRepository>({
            product_id: String,
            count: Number
        });
        this.schema = new Schema<CartRepositoryItem>({
            id: mongoose.Types.ObjectId,
            timestamp: Date,
            user_id: String,
            items_ref: [this.itemSchema]
        });

        this.collection = mongoose.model(this.collectionName, this.schema);
    }

    async setup(): Promise<void> {
        return new Promise((resolve, reject) => {
            mongoose.connect(
                this.connection.uri, 
                this.connection.options,
                (err: CallbackError) => {
                    if (err) reject(err);
                    resolve(undefined);
                })
        })
    }

    protected async _find(id: String): Promise<CartRepositoryItem> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        return cart;
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        let mongooseFilter: any = {};

        if (filter.user_id) mongooseFilter.user_id = { $eq: filter.user_id };

        const carts = await this.collection.find(mongooseFilter);
        return carts;
    }

    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const cart: CartRepositoryItem = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        }

        const inserted = await this.collection.create(cart);

        return inserted;
    }

    protected async _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem> {
        const cart = await this._find(id);

        await this.collection.updateOne({id}, {
            $set: { ...cart, ...cmd },
        });

        return cart;
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
        
        await this.collection.updateOne({id}, { $set: cart });

        return item;
    }
}

export default CartMongooseRepository;