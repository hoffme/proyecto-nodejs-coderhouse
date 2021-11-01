import mongoose, { Schema } from 'mongoose';

import { DAOMongoSettings } from '../../../models/storage/settings';

import { CreateUserCMD, FilterUserCMD, UpdateUserCMD, UserDAO, UserDTO } from '../../../models/user';

interface UserMongoose {
    _id: mongoose.Types.ObjectId
    type: string
    name: string
    lastname: string
    email: string
    phone: string
    hash: string
}

const toModel = (mongo: UserMongoose): UserDTO => {
    return {
        id: mongo._id?.toHexString() || '',
        type: mongo.type,
        name: mongo.name,
        lastname: mongo.lastname,
        email: mongo.email,
        phone: mongo.phone,
        hash: mongo.hash
    }
}

class ProductMongooseDAO implements UserDAO {

    private readonly settings: DAOMongoSettings;
    private readonly collectionName: string;
    private readonly schema: Schema<UserMongoose>;
    private readonly collection: mongoose.Model<UserMongoose>;

    constructor(settings: DAOMongoSettings) {
        this.settings = settings;
        this.collectionName = 'users';

        this.schema = new Schema<UserMongoose>({
            type: { type: String, required: true },
            name: { type: String, required: true },
            lastname: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
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

    async find(filter: FilterUserCMD): Promise<UserDTO> {
        const mongoFilter: any = {}
        if (filter.id) mongoFilter._id = filter.id;
        if (filter.email) mongoFilter.email = filter.email;

        const user = await this.collection.findOne(mongoFilter);
        if (!user) throw new Error("user not found");

        return toModel(user);
    }
    
    async create(cmd: CreateUserCMD): Promise<UserDTO> {
        const exist = await this.collection.findOne({ email: cmd.email });
        if (exist) throw new Error('user already register');

        const inserted = await this.collection.create({
            ...cmd
        });

        const user = toModel(inserted);

        return user;
    }

    async update(id: string, cmd: UpdateUserCMD): Promise<UserDTO> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("user not found");

        data.type = cmd.type || data.type;
        data.name = cmd.name || data.name;
        data.lastname = cmd.lastname || data.lastname;
        data.email = cmd.email || data.email;
        data.phone = cmd.phone || data.phone;
        data.hash = cmd.hash || data.hash;

        await data.save();

        const user = toModel(data);

        return user;
    }

    async delete(id: string): Promise<UserDTO> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("user not found");

        await data.deleteOne()

        const user = toModel(data);

        return user;
    }
}

export default ProductMongooseDAO;