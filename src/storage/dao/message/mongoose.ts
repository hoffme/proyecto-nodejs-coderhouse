import mongoose, { CallbackError, Schema } from 'mongoose';

import { DAOMongoSettings } from '../../../models/storage/settings';

import { MessageDAO, MessageDTO, CreateMessageCMD, FilterMessageCMD, UserDTO, MessageBy } from '../../../models/message/dao';

interface MessageMongoose {
    _id: mongoose.Types.ObjectId
    timestamp: Date
    by: MessageBy
    user: UserDTO
    chat_id: string
    body: string
}

const toModel = (data: MessageMongoose): MessageDTO => {
    return  {
        id: data._id?.toHexString() || '',
        timestamp: data.timestamp,
        by: data.by,
        user: data.user,
        chat_id: data.chat_id,
        body: data.body
    }
}

class MessageMongooseDAO implements MessageDAO {
    
    private readonly settings: DAOMongoSettings;
    private readonly collectionName: string;

    private readonly collection: mongoose.Model<MessageMongoose>;

    private readonly schema: Schema<MessageMongoose>;

    constructor(settings: DAOMongoSettings) {
        this.settings = settings;
        this.collectionName = 'messages';

        this.schema = new Schema<MessageMongoose>({
            timestamp: Date,
            by: String,
            user: {
                id: String,
                name: String,
                phone: String,
                email: String
            },
            chat_id: String,
            body: String
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

    async find(id: String): Promise<MessageDTO> {
        const Message = await this.collection.findById(id);
        if (!Message) throw new Error('Message not found');

        return toModel(Message);
    }

    async search(filter: FilterMessageCMD): Promise<MessageDTO[]> {
        let mongooseFilter: any = {};

        if (filter.by) mongooseFilter.by = { $eq: filter.by };
        if (filter.user_id) mongooseFilter['user.id'] = { $eq: filter.user_id };
        if (filter.chat_id) mongooseFilter.chat_id = { $eq: filter.chat_id };
        
        if (filter.from || filter.to) {
            let timestampFilter: any;
            
            if (filter.from) timestampFilter['$gt'] = filter.from;
            if (filter.to) timestampFilter['$lt'] = filter.to;

            mongooseFilter.timestamp = timestampFilter;
        }

        const page = filter.page || 0;
        const limit = filter.limit || 10000;
        
        const messages = await this.collection.find(mongooseFilter)
            .limit(limit)
            .skip(page * limit)
            .exec()

        return messages.map(Message => toModel(Message));
    }

    async create(cmd: CreateMessageCMD): Promise<MessageDTO> {
        const inserted = await this.collection.create({
            timestamp: new Date(),
            ...cmd
        });

        return toModel(inserted);
    }
    
    async delete(id: string): Promise<MessageDTO> {
        const data = await this.collection.findById(id);
        if (!data) throw new Error("Message not found");

        await data.deleteOne()

        const Message = toModel(data);

        return Message;
    }
}

export default MessageMongooseDAO;