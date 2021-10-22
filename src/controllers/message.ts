import Storage from '../storage';

import { FilterMessageCMD } from '../models/message/dao';

import Message from '../models/message/model';
import User from '../models/user/model';

class MessageController {

    async search(filter: FilterMessageCMD): Promise<Message[]> {
        return await Storage.repositories.message.search(filter);
    }

    async get(id: string): Promise<Message> {
        return await Storage.repositories.message.find(id);        
    }

    async createClient(user: User, body: string): Promise<Message> {
        return await Message.create({
            chat_id: user.id,
            by: 'client',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.phone
            },
            body
        })
    }

    async createSeller(user: User, chat_id: string, body: string): Promise<Message> {
        return await Message.create({
            chat_id,
            by: 'seller',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.phone
            },
            body
        })
    }

}

export default MessageController;