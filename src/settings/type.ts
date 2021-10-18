import ControllerSettings from "../controllers/settings";
import ServerSettings from "../server/settings";

interface Settings {
    cluster: boolean,
    controllers: ControllerSettings,
    server: ServerSettings
}

export default Settings;