import Controllers from './controllers';
import Server from './server';

import settings from './settings';

(async () => {
    await Controllers.setup(settings.controllers);
    await Server.setup(settings.server);

    Server.start();
})()