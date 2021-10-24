import Storage from './storage';
import Controllers from './controllers';
import Server from './server';
import Models from './models';

import { Settings } from './settings';

const runner = async (settings: Settings) => {
    await Storage.setup(settings.storage);
    await Models.setup(settings.models);
    await Controllers.setup(settings.controllers);
    await Server.setup(settings.server);

    Server.start();
};

export default runner;