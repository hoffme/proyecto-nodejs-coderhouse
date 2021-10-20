import { AuthSettings } from "./auth";
import { NotifierSettings } from "./notificator";

interface ControllerSettings {
    auth: AuthSettings
    notificator: NotifierSettings
}

export default ControllerSettings;