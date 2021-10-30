import dotenv from 'dotenv';

import ControllerSettings from "./controllers/settings";
import ModelsSettings from "./models/settings";
import ServerSettings from "./server/settings";
import StorageSettings from "./storage/settings";

dotenv.config();

interface Settings {
    cluster: boolean
    storage: StorageSettings
    models: ModelsSettings
    controllers: ControllerSettings
    server: ServerSettings
}

const settings: Settings = {
    cluster: process.env.MODE === 'cluster' ? true : false,
    storage: {
        product: {
            select: (process.env.STORAGE_PRODUCT_SELECT as any) || 'file',
            memory: {},
            file: { path: (process.env.STORAGE_PRODUCT_FILE_PATH as any) || './datos/products.json' },
            mongo: {
                uri: (process.env.STORAGE_PRODUCT_MONGO_URI as any) || '',
                options: {}
            }
        },
        cart: {
            select: (process.env.STORAGE_CART_SELECT as any) || 'file',
            memory: {},
            file: { path: (process.env.STORAGE_CART_FILE_PATH as any) || './datos/cart.json' },
            mongo: {
                uri: (process.env.STORAGE_CART_MONGO_URI as any) || '',
                options: {}
            }
        },
        user: {
            select: (process.env.STORAGE_USER_SELECT as any) || 'file',
            memory: {},
            file: { path: (process.env.STORAGE_USER_FILE_PATH as any) || './datos/user.json' },
            mongo: {
                uri: (process.env.STORAGE_USER_MONGO_URI as any) || '',
                options: {}
            }
        },
        order: {
            select: (process.env.STORAGE_ORDER_SELECT as any) || 'file',
            memory: {},
            file: { path: (process.env.STORAGE_ORDER_FILE_PATH as any) || './datos/order.json' },
            mongo: {
                uri: (process.env.STORAGE_ORDER_MONGO_URI as any) || '',
                options: {}
            }
        },
        message: {
            select: (process.env.STORAGE_MESSAGE_SELECT as any) || 'file',
            memory: {},
            file: { path: (process.env.STORAGE_MESSAGE_FILE_PATH as any) || './datos/message.json' },
            mongo: {
                uri: (process.env.STORAGE_MESSAGE_MONGO_URI as any) || '',
                options: {}
            }
        }
    },
    models: {
        notificator: {
            senders: {
                mail: {
                    user: process.env.MODELS_NOTIFICATOR_SENDER_MAIL_USER || 'phjocoronel17@gmail.com',
                    pass: process.env.MODELS_NOTIFICATOR_SENDER_MAIL_PASS || 'password'
                }
            },
            reciver: {
                admin_mail: process.env.MODELS_NOTIFICATOR_RECEIVER_ADMIN || 'phjocoronel@gmail.com',
                errors_mail: process.env.MODELS_NOTIFICATOR_RECEIVER_ERROR || 'phjocoronel@gmail.com'
            }
        }
    },
    controllers: {
        auth: {
            jwt_secret: process.env.CONTROLLERS_AUTH_JWT_SECRET || 'shhhhhh'
        }
    },
    server: {
        port: process.env.PORT || '5000',
        rest: {
            session_secret: process.env.SERVER_REST_SESSION_SECRET || 'shhhhhh',
            session_max_age: parseInt(process.env.SERVER_REST_SESSION_MAX_AGE || '40000')
        },
        realtime: {}
    }
}

export default settings;
export type {
    Settings
}