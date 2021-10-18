import Controllers from './controllers';
import Server from './server';

import Settings from './settings/type';

const runner = async (settings: Settings) => {
    await Controllers.setup(settings.controllers);
    await Server.setup(settings.server);

    Server.start();
};

export default runner;