import { Socket } from "socket.io";

import { Message, MessageBy } from "../../../models/message";
import { User } from "../../../models/user";

interface FilterMessage {
    by?: MessageBy
    chat_id?: string
}

interface FollowData {
    user: User
    socket: Socket
    filter: FilterMessage
}

class MessageEvents {

    private readonly followers = new Map<string, FollowData>();

    constructor() {
        Message.on.create.listen(message => {
            Array.from(this.followers.values()).forEach(subs => {
                if (subs.user.type === 'client' && subs.user.id !== message.chat_id) return;

                if (subs.filter.by && subs.filter.by !== message.by) return;
                if (subs.filter.chat_id && subs.filter.chat_id !== message.chat_id) return;

                subs.socket.emit('/message/new', message.json());
            });
        })
    }

    public init(socket: Socket) {        
        socket.on("/message/follow", (filter: FilterMessage) => {
            const user: User = socket.handshake.auth.user;

            this.followers.set(socket.id, {
                user,
                socket,
                filter
            })
        })

        socket.on("/message/unfollow", () => {
            this.followers.delete(socket.id)
        })

        socket.on("disconnect", () => {
            this.followers.delete(socket.id);
        })
    }

}

export default MessageEvents;