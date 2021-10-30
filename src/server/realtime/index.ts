import { Server as HTTPServer} from "http";
import { Server as IOServer } from 'socket.io';

import Controllers from "../../controllers";

import RealtimeManager from "./manager";

import RealtimeSettings from "./settings";

const realtimeRouter = async (server: HTTPServer, settings: RealtimeSettings): Promise<void> => {
    const manager = new RealtimeManager();

    const io = new IOServer(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const access = socket.handshake.auth.token;
        
        Controllers.auth.getUser({ access })
            .then((user) => {
                socket.handshake.auth.user = user;
                next()
            })
            .catch(() => {
                next(new Error('unauthorized'))
            })
    })

    io.on("connection", (socket) => {
        manager.newConnection(socket)
    });
}

export default realtimeRouter;