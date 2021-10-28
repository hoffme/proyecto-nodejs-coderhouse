import { User } from "./user";
import { Product } from "./product";
import { Cart } from "./cart";
import { Order } from "./order";
import { Message } from "./message";
import ErrorManager from "./error";
import Notificator from "./notificator";

import Storage from "../storage";

import ModelsSettings from "./settings";

class Models {

    public static async setup(settings: ModelsSettings): Promise<void> {
        ErrorManager.on.error.listen(console.error);

        User.setDAO(await Storage.factories.user.instance());
        Product.setDAO(await Storage.factories.product.instance());
        Cart.setDAO(await Storage.factories.cart.instance());
        Order.setDAO(await Storage.factories.order.instance());
        Message.setDAO(await Storage.factories.message.instance());

        await Notificator.setup(settings.notificator);
    }
}

export default Models;