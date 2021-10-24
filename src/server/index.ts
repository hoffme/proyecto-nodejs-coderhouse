import { Server as HTTPServer } from 'http';

import realtimeRouter from './realtime';
import restRouter from './rest';

import ServerSettings from './settings';

class Server {

    private static settings: ServerSettings;

    private static server: HTTPServer;

    static async setup(settings: ServerSettings): Promise<void> {
        this.settings = settings;

        await this.httpServer();
    }

    private static async httpServer(): Promise<void> {
        const router = await restRouter(this.settings.rest);

        this.server = new HTTPServer(router);

        await realtimeRouter(this.server, this.settings.realtime);
    }

    static start() {
        this.server.listen(this.settings.port, () => {
            console.log(`Listening on http://localhost:${this.settings.port}`);
        });
    }
}

export default Server;