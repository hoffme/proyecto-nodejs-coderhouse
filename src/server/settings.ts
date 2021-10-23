import RealtimeSettings from "./realtime/settings";
import RestSettings from "./rest/settings";

interface ServerSettings {
    port: string
    rest: RestSettings
    realtime: RealtimeSettings
}

export default ServerSettings;