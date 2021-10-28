import { Message, FilterMessageCMD } from '../../models/message';
import { User } from '../../models/user';

import Controller from '../controller';

class MessageController extends Controller {

    async search(filter: FilterMessageCMD): Promise<Message[]> {
        return Controller.secureMethod(async () => {
            return await Message.search(filter);
        });
    }

    async get(id: string): Promise<Message> {
        return Controller.secureMethod(async () => {
            return await Message.getById(id);
        });
    }

    async createClient(user: User, body: string): Promise<Message> {
        return Controller.secureMethod(async () => {
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
        });
    }

    async createSeller(user: User, chat_id: string, body: string): Promise<Message> {
        return Controller.secureMethod(async () => {
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
        });
    }
}

export default MessageController;