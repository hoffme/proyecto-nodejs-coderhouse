import ProductsController from "./product";
import CartController from "./cart";
import UserController from "./user";
import NotifierController from "./notificator";

import ControllerSettings from "./settings";

class Controllers {

    static user: UserController;
    static products: ProductsController;
    static cart: CartController;
    static notifier: NotifierController;

    static async setup(settings: ControllerSettings) {
        Controllers.notifier = new NotifierController(settings.notificator);
        
        Controllers.user = new UserController()
        Controllers.products = new ProductsController();
        Controllers.cart = new CartController();
    }
}

export default Controllers