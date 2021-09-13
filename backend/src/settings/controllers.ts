import ControllerSettings from "../controllers/settings";

// import { firestore } from "../storage/firebase/firebase";

const controllerSettings: ControllerSettings = {
    product: {
        // memory: {},
        file: { path: './datos/products.json' },
        // mongoose: {
        //     uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        //     options: {}
        // }
        // knex: {
        //     connection: {
        //         client: 'mysql',
        //         connection: {
        //             host: '127.0.0.1',
        //             database: 'ecommerce',
        //             user: 'hoffme',
        //             password: 'FeZb13392128'
        //         },
        //         debug: true
        //     }
        // }
        // firestore: {
        //     firestore: firestore
        // }
    },
    cart: {
        // memory: {},
        file: { path: './datos/cart.json' },
        // mongoose: {
        //     uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        //     options: {}
        // }
        // knex: {
        //     connection: {
        //         client: 'mysql',
        //         connection: {
        //             host: '127.0.0.1',
        //             database: 'ecommerce',
        //             user: 'hoffme',
        //             password: 'FeZb13392128'
        //         },
        //         debug: true
        //     }
        // }
        // firestore: {
        //     firestore: firestore
        // }
    },
    user: {
        // memory: {},
        file: { path: './datos/user.json' },
        // mongoose: {
        //     uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        //     options: {}
        // }
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
}

export default controllerSettings;