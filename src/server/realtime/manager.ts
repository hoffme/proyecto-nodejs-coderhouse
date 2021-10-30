import { Socket } from 'socket.io';

import MessageEvents from './events/message';

class RealtimeManager {

    private readonly messages: MessageEvents;

    constructor() {
        this.messages = new MessageEvents();
    }

    public newConnection(socket: Socket) {
        this.messages.init(socket);
    }

}

export default RealtimeManager;