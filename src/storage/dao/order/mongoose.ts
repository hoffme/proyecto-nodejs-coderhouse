import mongoose, { CallbackError, Schema } from 'mongoose';

import { DAOMongoSettings } from '../../../models/storage/settings';

import { AddressDTO, OrderDAO, OrderDTO, CreateOrderCMD, FilterOrderCMD, ItemDTO, UpdateOrderCMD, OrderState, UserDTO } from '../../../models/order/dao';

interface OrderMongoose {
    _id: mongoose.Types.ObjectId
    timestamp: Date
    state: OrderState
    user: UserDTO
    items: ItemDTO[],
    address: AddressDTO,
    total: number
}

const toModel = (data: OrderMongoose): OrderDTO => {
    return  {
        id: data._id?.toHexString() || '',
        timestamp: data.timestamp,
        state: data.state,
        user: data.user,
        items: data.items,
        address: data.address,
        total: data.total
    }
}

class OrderMongooseDAO implements OrderDAO {
    
    private readonly settings: DAOMongoSettings;
    private readonly collectionName: string;

    private readonly collection: mongoose.Model<OrderMongoose>;

    private readonly itemSchema: Schema<ItemDTO>;
    private readonly schema: Schema<OrderMongoose>;

    constructor(settings: DAOMongoSettings) {
        this.settings = settings;
        this.collectionName = 'Orders';

        this.itemSchema = new Schema<ItemDTO>({
            id: String,
            name: String,
            unit_price: Number,
            quantity: Number,
            total: Number
        });
        this.schema = new Schema<OrderMongoose>({
            timestamp: Date,
            user_id: String,
            items_ref: [this.itemSchema],
            user: {
                id: String,
                name: String,
                phone: String,
                email: String
            },
            state: String,
            address: {
                city: String,
                zip_code: String,
                street: String,
                number: String,
                indications: String
            },
            total: Number
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

    async find(id: String): Promise<OrderDTO> {
        const Order = await this.collection.findById(id);
        if (!Order) throw new Error('Order not found');

        return toModel(Order);
    }

    async search(filter: FilterOrderCMD): Promise<OrderDTO[]> {
        let mongooseFilter: any = {};

        if (filter.user_id) mongooseFilter['user.id'] = { $eq: filter.user_id };

        const Orders = await this.collection.find(mongooseFilter);
        return Orders.map(Order => toModel(Order));
    }

    async create(cmd: CreateOrderCMD): Promise<OrderDTO> {
        const inserted = await this.collection.create({
            timestamp: new Date(),
            ...cmd
        });

        return toModel(inserted);
    }

    async update(id: string, cmd: UpdateOrderCMD): Promise<OrderDTO> {
        const Order = await this.collection.findById(id);
        if (!Order) throw new Error('Order not found');

        Order.user = cmd.user || Order.user;
        Order.state = cmd.state || Order.state;
        Order.address = cmd.address || Order.address;
        Order.items = cmd.items || Order.items;
        Order.total = cmd.total || Order.total;

        await Order.save();

        return toModel(Order);
    }
    
    async delete(id: string): Promise<OrderDTO> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("Order not found");

        await data.deleteOne()

        const Order = toModel(data);

        return Order;
    }
}

export default OrderMongooseDAO;