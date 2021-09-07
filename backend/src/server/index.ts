import { Server as HTTPServer } from 'http';
import createRouter from './routers';

import ServerSettings from './settings';

class Server {

    private static settings: ServerSettings;

    private static server: HTTPServer;

    static async setup(settings: ServerSettings): Promise<void> {
        this.settings = settings;

        await this.httpServer();
    }

    private static async httpServer(): Promise<void> {
        const router = await createRouter(this.settings.router);
        this.server = new HTTPServer(router);
    }

    static start() {
        this.server.listen(this.settings.port, () => {
            console.log(`Listening on http://localhost:${this.settings.port}`);
        });
    }
}

export default Server;