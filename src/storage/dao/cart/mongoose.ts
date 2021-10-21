import mongoose, { CallbackError, Schema } from 'mongoose';

import { DAOMongoSettings } from '../../../models/storage/settings';

import { AddressDTO, CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from '../../../models/cart/dao';

interface CartMongoose {
    _id: mongoose.Types.ObjectId
    timestamp: Date
    user_id: string
    items_ref: ItemDTO[],
    address: AddressDTO,
    total: number
}

const toModel = (data: CartMongoose): CartDTO => {
    return  {
        id: data._id?.toHexString() || '',
        timestamp: data.timestamp,
        user_id: data.user_id,
        items_ref: data.items_ref,
        address: data.address,
        total: data.total
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
            ...cmd
        });

        return toModel(inserted);
    }

    async update(id: string, cmd: UpdateCartCMD): Promise<CartDTO> {
        const cart = await this.collection.findById(id);
        if (!cart) throw new Error('cart not found');

        cart.address = cmd.address || cart.address;
        cart.items_ref = cmd.items_ref || cart.items_ref;
        cart.total = cmd.total || cart.total;

        await cart.save();

        return toModel(cart);
    }
    
    async delete(id: string): Promise<CartDTO> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("cart not found");

        await data.deleteOne()

        const cart = toModel(data);

        return cart;
    }
}

export default CartMongooseDAO;