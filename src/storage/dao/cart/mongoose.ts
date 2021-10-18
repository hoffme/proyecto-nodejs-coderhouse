import mongoose, { CallbackError, Schema } from 'mongoose';

import { DAOMongoSettings } from '../../../models/storage/settings';

import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from '../../../models/cart/dao';

interface CartMongoose {
    _id: mongoose.Types.ObjectId
    timestamp: Date
    user_id: string
    items_ref: ItemDTO[]
}

const toModel = (data: CartMongoose): CartDTO => {
    return  {
        id: data._id?.toHexString() || '',
        timestamp: data.timestamp,
        user_id: data.user_id?.toString() || '',
        items_ref: data.items_ref || undefined
    }
}

class CartMongooseDAO implements CartDAO {
    
    private readonly settings: DAOMongoSettings;
    private readonly collectionName: string;

    private readonly collection: mongoose.Model<CartMongoose>;

    private readonly itemSchema: Schema<ItemDTO>;
    private readonly schema: Schema<CartMongoose>;

    constructor(settings: DAOMongoSettings) {
        this.settings = settings;
        this.collectionName = 'carts';

        this.itemSchema = new Schema<ItemDTO>({
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

    async find(id: String): Promise<CartDTO> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        return toModel(cart);
    }

    async search(filter: FilterCartCMD): Promise<CartDTO[]> {
        let mongooseFilter: any = {};

        if (filter.user_id) mongooseFilter.user_id = { $eq: filter.user_id };

        const carts = await this.collection.find(mongooseFilter);
        return carts.map(cart => toModel(cart));
    }

    async create(cmd: CreateCartCMD): Promise<CartDTO> {
        const inserted = await this.collection.create({
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        });

        return toModel(inserted);
    }

    async update(id: string, cmd: UpdateCartCMD): Promise<CartDTO> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        cart.user_id = cmd.user_id || cart.user_id;

        await cart.save();

        return toModel(cart);
    }

    async clear(id: string): Promise<CartDTO> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        cart.items_ref = [];

        await cart.save();

        return toModel(cart);
    }

    async setItem(id: string, item: ItemDTO): Promise<ItemDTO> {
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

    async remItem(id: string, product_id: string): Promise<ItemDTO> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');
        
        let result: ItemDTO | undefined;
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

export default CartMongooseDAO;