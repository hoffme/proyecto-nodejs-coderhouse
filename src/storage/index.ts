import ProductDAOFactory from "./factories/product";
import CartDAOFactory from "./factories/cart";
import UserDAOFactory from "./factories/user";
import OrderDAOFactory from "./factories/order";
import MessageDAOFactory from "./factories/message";

import StorageSettings from "./settings";

class Storage {

    public static readonly factories = {
        user: new UserDAOFactory(),
        product: new ProductDAOFactory(),
        cart: new CartDAOFactory(),
        order: new OrderDAOFactory(),
        message: new MessageDAOFactory()
    }

    public static async setup(settings: StorageSettings): Promise<void> {
        this.factories.user.setSettings(settings.user);
        this.factories.product.setSettings(settings.product);
        this.factories.cart.setSettings(settings.cart);
        this.factories.order.setSettings(settings.order);
        this.factories.message.setSettings(settings.message);
    }

}

export default Storage;