import { EventManager } from "../../utils/events";

import { CreateMessageCMD, FilterMessageCMD, MessageBy, MessageDAO, MessageDTO, UserDTO } from "./dao";

class Message {

    private static dao: MessageDAO;

    private static readonly events = {
        create: new EventManager<Message>(),
        update: new EventManager<Message>(),
        delete: new EventManager<Message>()
    }

    public static get on() {
        return {
            create: this.events.create.register,
            update: this.events.update.register,
            delete: this.events.delete.register
        }
    }
    
    private _data: MessageDTO;
    private _deleted: boolean;

    public static async getById(id: string): Promise<Message> {
        const dto = await Message.dao.find(id);
        return new Message(dto);
    }

    public static async search(filter: FilterMessageCMD): Promise<Message[]> {
        const dtos = await Message.dao.search(filter);
        return dtos.map(dto => new Message(dto));
    }

    public static async create(fields: CreateMessageCMD): Promise<Message> {
        const dto = await Message.dao.create(fields);
        const message = new Message(dto);
    
        Message.events.create.notify(message);

        return message;
    }

    public static setDAO(dao: MessageDAO) {
        this.dao = dao;
    }

    private constructor(data: MessageDTO) {
        this._data = data;
        this._deleted = false;
    }

    public get id(): string { return this._data.id }
    public get timestamp(): Date { return this._data.timestamp }
    public get by(): MessageBy { return this._data.by }
    public get chat_id(): string { return this._data.chat_id }
    public get user(): UserDTO { return this._data.user }
    public get body(): string { return this._data.body }

    public get deleted(): boolean { return this._deleted }

    json(): any { return { ...this._data } }

}

export default Message;