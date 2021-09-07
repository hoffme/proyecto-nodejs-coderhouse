import mongoose, { Schema } from 'mongoose';

import UserRepository, { FilterUserCMD, User, CreatUserCMD, UpdateUserCMD } from '../../../core/user/repository';

import MongooseSettings from '../../settings/mongoose';

interface UserMongoose {
    _id: mongoose.Types.ObjectId
    name: string
    lastname: string
    email: string
    phone: string
    age: string
    avatar: string
    address: {
        country: string
        city: string
        street: string
        number: string
        aditional: string
    }
    hash: string
}

const toModel = (mongo: UserMongoose): User => {
    return {
        id: mongo._id?.toHexString() || '',
        name: mongo.name,
        lastname: mongo.lastname,
        email: mongo.email,
        phone: mongo.phone,
        age: mongo.age,
        avatar: mongo.avatar,
        address: mongo.address,
        hash: mongo.hash
    }
}

class ProductMongooseRepository extends UserRepository {

    private readonly settings: MongooseSettings;
    private readonly collectionName: string;
    private readonly schema: Schema<UserMongoose>;
    private readonly collection: mongoose.Model<UserMongoose>;

    constructor(settings: MongooseSettings) {
        super();

        this.settings = settings;
        this.collectionName = 'users';

        this.schema = new Schema<UserMongoose>({
            name: { type: String, required: true },
            lastname: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            age: { type: Number, required: true },
            avatar: { type: String, required: true },
            address: {
                country: { type: String, required: true },
                city: { type: String, required: true },
                street: { type: String, required: true },
                number: { type: String, required: true },
                aditional: { type: String, required: true },
            },
            hash: { type: String, required: true },
        });

        this.collection = mongoose.model(this.collectionName, this.schema);
    }

    async setup(): Promise<void> {
        await new Promise((resolve, reject) => {
            mongoose.connect(
                this.settings.uri, 
                this.settings.options,
                (err) => {
                    if (err) reject(err);
                    resolve(undefined);
                })
        })
    }

    async find(filter: FilterUserCMD): Promise<User | undefined> {
        if (!filter.email && !filter.id) return undefined;

        const mongoFilter: any = {}
        if (filter.id) mongoFilter._id = filter.id;
        if (filter.email) mongoFilter.email = filter.email;

        const user = await this.collection.findById(mongoFilter);
        if (!user) throw new Error("user not found");

        return toModel(user);
    }
    
    async create(cmd: CreatUserCMD): Promise<User> {
        const exist = await this.find({ email: cmd.email });
        if (exist) throw new Error('user already register');

        const inserted = await this.collection.create({
            ...cmd
        });

        const user = toModel(inserted);

        this.events.create.notify(user);

        return user;
    }

    async update(id: string, cmd: UpdateUserCMD): Promise<User> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("user not found");

        data.name = cmd.name || data.name;
        data.lastname = cmd.lastname || data.lastname;
        data.email = cmd.email || data.email;
        data.phone = cmd.phone || data.phone;
        data.age = cmd.age || data.age;
        data.avatar = cmd.avatar || data.avatar;
        data.hash = cmd.hash || data.hash;

        data.address.country = cmd.address?.country || data.address.country;
        data.address.city = cmd.address?.city || data.address.city;
        data.address.street = cmd.address?.street || data.address.street;
        data.address.number = cmd.address?.number || data.address.number;
        data.address.aditional = cmd.address?.aditional || data.address.aditional;

        await data.save();

        const user = toModel(data);

        this.events.update.notify(user);

        return user;
    }

    async delete(id: string): Promise<User> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("user not found");

        await data.deleteOne()

        const user = toModel(data);

        this.events.remove.notify(user);

        return user;
    }
}

export default ProductMongooseRepository;