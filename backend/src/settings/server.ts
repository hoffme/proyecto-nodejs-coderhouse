import ServerSettings from "../server/settings";

const serverSettings: ServerSettings = {
    port: process.env.PORT || '8080'
}

export default serverSettings;