import ControllerSettings from "../controllers/settings";

const controllerSettings: ControllerSettings = {
    product: {
        // memory: {},
        // file: { path: './datos/products.json' },
        mongoose: {
            uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            options: {}
        }
    },
    cart: {
        mongoose: {
            uri: 'mongodb+srv://hoffme:FeZb13392128@db.jdimd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            options: {}
        }
    }
}

export default controllerSettings;