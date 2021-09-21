import ProductsController from "./product";
import CartController from "./cart";
import UserController from "./user";
import NotifierController from "./notificator";

import ProductRepositoryFactory from "../storage/factories/product";
import CartRepositoryFactory from "../storage/factories/cart";
import UserRepositoryFactory from "../storage/factories/user";

import ControllerSettings from "./settings";

class Controllers {

    static user: UserController;
    static products: ProductsController;
    static cart: CartController;
    static notifier: NotifierController;

    static async setup(settings: ControllerSettings) {
        await UserRepositoryFactory.build(settings.user);
        await ProductRepositoryFactory.build(settings.product);
        await CartRepositoryFactory.build(ProductRepositoryFactory.repository, settings.cart);

        Controllers.user = new UserController(UserRepositoryFactory.repository)
        Controllers.products = new ProductsController(ProductRepositoryFactory.repository);
        Controllers.cart = new CartController(CartRepositoryFactory.repository);
        Controllers.notifier = new NotifierController(settings.notificator);
    }
}

export default Controllers