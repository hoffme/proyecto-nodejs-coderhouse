import { EventManager } from "../../utils/events";

import { MessageBy } from "./dao";

import Message from "./model"

interface FilterMessage {
    by?: MessageBy
    user_id?: string
    chat_id?: string
}

class Chat {

    private static readonly events = {
        message: new EventManager<Message>(),
    }

    public static get on() {
        return {
            message: this.events.message.register
        }
    }

    private readonly filter: FilterMessage;
    private started: boolean

    constructor(filter: FilterMessage) {
        this.filter = filter;
        this.started = false;
    }

    public start() {
        if (this.started) this.close();

        Message.on.create.listen(this.listen)
        this.started = true;
    }

    public close() {
        if (!this.started) return;

        Message.on.create.remove(this.listen);
        this.started = false;
    }

    private listen(message: Message) {
        if (this.filter.by && this.filter.by !== message.by) return;
        if (this.filter.user_id && this.filter.user_id !== message.user.id) return;
        if (this.filter.chat_id && this.filter.chat_id !== message.chat_id) return;

        Chat.events.message.notify(message);
    }

}

export default Chat;
export { FilterMessage }