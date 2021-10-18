import BuilderSettings from "../storage/factories/settings";
import { NotifierSettings } from "./notificator";

interface ControllerSettings {
    product: BuilderSettings
    cart: BuilderSettings
    user: BuilderSettings
    notificator: NotifierSettings
}

export default ControllerSettings;