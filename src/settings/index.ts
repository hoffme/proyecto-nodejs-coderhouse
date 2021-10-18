import controllerSettings from "./controllers";
import serverSettings from "./server";

import Settings from "./type";

const settings: Settings = {
    cluster: false,
    controllers: controllerSettings,
    server: serverSettings
}

export default settings;