import ServerSettings from "../server/settings";

const serverSettings: ServerSettings = {
    port: process.env.PORT || '8080',
    router: {
        session_secret: 'SESSION SECRET'
    }
}

export default serverSettings;