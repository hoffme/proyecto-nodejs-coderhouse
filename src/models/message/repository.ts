import { CreateMessageCMD, FilterMessageCMD } from "./dao";
import Message from "./model";

class MessageRepository {
    
    public async find(id: string): Promise<Message> {
        return Message.getById(id);
    }

    public async search(filter: FilterMessageCMD): Promise<Message[]> {
        return Message.search(filter);
    }

    public async create(fields: CreateMessageCMD): Promise<Message> {
        return Message.create(fields);
    }
    
}

export default MessageRepository;
export type {
    FilterMessageCMD,
    CreateMessageCMD
}