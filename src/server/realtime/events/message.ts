import { Socket } from "socket.io";

import { Chat, FilterMessage } from "../../../models/message";

class MessageEvents {

    private readonly chats = new Map<String, Chat[]>();

    public init(socket: Socket) {
        socket.on("/message/register", (filter: FilterMessage) => {
            const user = socket.handshake.auth.user;

            const chat = new Chat({ ...filter, user_id: user.id });

            chat.on.message.listen(message => {
                socket.emit("/message/new", filter, message.json());
            });

            chat.start();

            if (this.chats.has(socket.id)) {
                this.chats.get(socket.id)?.push(chat);
            }
            else {
                this.chats.set(socket.id, [chat]);
            }
        })
    }

    public close(socket: Socket) {
        const chats = this.chats.get(socket.id);
        if (!chats) return;

        chats.forEach(chat => chat.close());

        this.chats.delete(socket.id);
    }

}

export default MessageEvents;