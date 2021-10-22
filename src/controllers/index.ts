import AuthController from "./auth";
import ProductsController from "./product";
import CartController from "./cart";
import UserController from "./user";
import OrderController from "./order";
import NotifierController from "./notificator";

import ControllerSettings from "./settings";

class Controllers {

    static auth: AuthController;
    static user: UserController;
    static products: ProductsController;
    static cart: CartController;
    static order: OrderController;
    static notifier: NotifierController;

    static async setup(settings: ControllerSettings) {
        Controllers.auth = new AuthController(settings.auth);
        Controllers.user = new UserController();
        Controllers.products = new ProductsController();
        Controllers.cart = new CartController();
        Controllers.order = new OrderController();
        Controllers.notifier = new NotifierController(settings.notificator);
    }
}

export default Controllers