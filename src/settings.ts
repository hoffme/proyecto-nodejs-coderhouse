import ControllerSettings from "./controllers/settings";
import ModelsSettings from "./models/settings";
import ServerSettings from "./server/settings";
import StorageSettings from "./storage/settings";

interface Settings {
    cluster: boolean
    storage: StorageSettings
    models: ModelsSettings
    controllers: ControllerSettings
    server: ServerSettings
}

const settings: Settings = {
    cluster: false,
    storage: {
        product: {
            select: 'file',
            memory: {},
            file: { path: './datos/products.json' },
            mongo: {
                uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                options: {}
            }
        },
        cart: {
            select: 'file',
            memory: {},
            file: { path: './datos/cart.json' },
            mongo: {
                uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                options: {}
            }
        },
        user: {
            select: 'file',
            memory: {},
            file: { path: './datos/user.json' },
            mongo: {
                uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                options: {}
            }
        },
        order: {
            select: 'file',
            memory: {},
            file: { path: './datos/order.json' },
            mongo: {
                uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                options: {}
            }
        },
        message: {
            select: 'file',
            memory: {},
            file: { path: './datos/message.json' },
            mongo: {
                uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
                options: {}
            }
        }
    },
    models: {},
    controllers: {
        auth: {
            jwt_secret: 'shhhhhh'
        },
        notificator: {
            senders: {
                // mail: {
                //     user: 'phjocoronel17@gmail.com',
                //     pass: 'FeZb13392128'
                // },
                // twilio: {
                //     account_sid: 'AC7230ab8c825e1d345e1402967c87dd7d',
                //     auth_token: '8125f99d1fe862acf6a2a594d27db921',
                //     phone: '+16174544586'
                // }
            },
            reciver: {
                // mail: 'phjocoronel@gmail.com',
                // phone: '+542396610172'
            }
        }
    },
    server: {
        port: process.env.PORT || '5000',
        rest: {
            session_secret: 'SESSION SECRET'
        },
        realtime: {}
    }
}

export default settings;
export type {
    Settings
}