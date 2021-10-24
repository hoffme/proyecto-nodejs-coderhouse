import { DAOFileSettings } from '../../../models/storage/settings';

import { MessageDAO, MessageDTO, CreateMessageCMD, FilterMessageCMD } from '../../../models/message';

import FileStorage from '../../../utils/file';
import uuid from '../../../utils/uuid';

class MessageFileDAO implements MessageDAO {
    
    private file: FileStorage<{[id: string]: MessageDTO}>

    constructor(setting: DAOFileSettings) {
        this.file = new FileStorage(setting.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch (e) { await this.file.set({}) }
    }

    async find(id: string): Promise<MessageDTO> {
        const items = await this.file.get();

        const Message = items[id];
        if (!Message) throw new Error('Message not found');

        return Message;
    }

    async search(filter: FilterMessageCMD): Promise<MessageDTO[]> {
        const items = await this.file.get();

        let result = Object.values(items).filter(item => {
            if (filter.by && filter.by != item.by) return false; 
            if (filter.user_id && filter.user_id != item.user.id) return false; 
            if (filter.chat_id && filter.chat_id != item.chat_id) return false; 
            if (filter.from && filter.from.getTime() - item.timestamp.getTime() > 0) return false;
            if (filter.to && filter.to.getTime() - item.timestamp.getTime() < 0) return false;
            
            return true;
        })

        const page = filter.page || 0;
        const limit = filter.limit || result.length

        return result.slice((page * limit), (page * limit) + limit);
    }

    async create(cmd: CreateMessageCMD): Promise<MessageDTO> {
        const Message: MessageDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        const items = await this.file.get();
        items[Message.id] = Message;

        await this.file.set(items);

        return Message;
    }

    async delete(id: string): Promise<MessageDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('Message not found');
        
        const model = items[id];
        delete items[id];

        await this.file.set(items);

        return model;
    }
}

export default MessageFileDAO;