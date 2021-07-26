import mongoose, { CallbackError, Schema } from 'mongoose';

import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';
import ProductRepository from '../../../core/product/repository';

import MongooseSettings from '../../settings/mongoose';

interface CartMongoose {
    _id: mongoose.Types.ObjectId
    timestamp: Date
    user_id: string
    items_ref: ItemRepository[]
}

const toModel = (data: CartMongoose): CartRepositoryItem => {
    return  {
        id: data._id?.toHexString() || '',
        timestamp: data.timestamp,
        user_id: data.user_id?.toString() || '',
        items_ref: data.items_ref || undefined
    }
}

class CartMongooseRepository extends CartRepository {
    
    private readonly settings: MongooseSettings;
    private readonly collectionName: string;

    private readonly collection: mongoose.Model<CartMongoose>;

    private readonly itemSchema: Schema<ItemRepository>;
    private readonly schema: Schema<CartMongoose>;

    constructor(products: ProductRepository, settings: MongooseSettings) {
        super(products);

        this.settings = settings;
        this.collectionName = 'carts';

        this.itemSchema = new Schema<ItemRepository>({
            product_id: String,
            count: Number
        });
        this.schema = new Schema<CartMongoose>({
            timestamp: Date,
            user_id: String,
            items_ref: [this.itemSchema]
        });

        this.collection = mongoose.model(this.collectionName, this.schema);
    }

    async setup(): Promise<void> {
        return new Promise((resolve, reject) => {
            mongoose.connect(
                this.settings.uri, 
                this.settings.options,
                (err: CallbackError) => {
                    if (err) reject(err);
                    resolve(undefined);
                })
        })
    }

    protected async _find(id: String): Promise<CartRepositoryItem> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        return toModel(cart);
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        let mongooseFilter: any = {};

        if (filter.user_id) mongooseFilter.user_id = { $eq: filter.user_id };

        const carts = await this.collection.find(mongooseFilter);
        return carts.map(cart => toModel(cart));
    }

    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const inserted = await this.collection.create({
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        });

        return toModel(inserted);
    }

    protected async _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        cart.user_id = cmd.user_id || cart.user_id;

        await cart.save();

        return toModel(cart);
    }

    protected async _clear(id: string): Promise<CartRepositoryItem> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        cart.items_ref = [];

        await cart.save();

        return toModel(cart);
    }

    protected async _setItem(id: string, item: ItemRepository): Promise<ItemRepository> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');
        
        let added = false;
        cart.items_ref = cart.items_ref.map(item => {
            if (item.product_id !== item.product_id) return item;
            
            added = true;
            return item;
        })

        if (!added) cart.items_ref.push(item);
        
        await cart.save();

        return item;
    }

    protected async _remItem(id: string, product_id: string): Promise<ItemRepository> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');
        
        let result: ItemRepository | undefined;
        cart.items_ref = cart.items_ref.filter(item => {
            if (item.product_id !== product_id) return true;
            
            result = item;
            return false;
        });

        if (!result) throw new Error('item not found');
    
        await cart.save();

        return result;
    }
}

export default CartMongooseRepository;