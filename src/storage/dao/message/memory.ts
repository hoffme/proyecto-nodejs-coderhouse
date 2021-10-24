import { DAOMemorySettings } from '../../../models/storage/settings';

import { MessageDAO, MessageDTO, CreateMessageCMD, FilterMessageCMD } from '../../../models/message';

import uuid from "../../../utils/uuid";

class MessageMemoryDAO implements MessageDAO {
    
    private items: MessageDTO[];
    
    constructor(settings: DAOMemorySettings) {
        this.items = [];
    }
    
    async find(id: String): Promise<MessageDTO> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('Message not found');

        return result;
    }
    
    async search(filter: FilterMessageCMD): Promise<MessageDTO[]> {
        let result = this.items.filter(item => {
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
            ...cmd,
        }

        this.items.push(Message);

        return Message;
    }

    async delete(id: string): Promise<MessageDTO> {
        const Message = await this.find(id);

        this.items = this.items.filter(item => item.id !== id);

        return Message;
    }
}


export default MessageMemoryDAO;