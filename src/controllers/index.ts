import ProductsController from "./product";
import CartController from "./cart";
import UserController from "./user";
import NotifierController from "./notificator";

import User from "../models/user/model";
import Product from "../models/product/model";
import Cart from "../models/cart/model";

import ProductDAOFactory from "../storage/factories/product";
import CartDAOFactory from "../storage/factories/cart";
import UserDAOFactory from "../storage/factories/user";

import ControllerSettings from "./settings";

class Controllers {

    static user: UserController;
    static products: ProductsController;
    static cart: CartController;
    static notifier: NotifierController;

    static async setup(settings: ControllerSettings) {
        User.setDAO(await UserDAOFactory.build(settings.user));
        Product.setDAO(await ProductDAOFactory.build(settings.product));
        Cart.setDAO(await CartDAOFactory.build(settings.cart));

        Controllers.notifier = new NotifierController(settings.notificator);

        Controllers.user = new UserController()
        Controllers.products = new ProductsController();
        Controllers.cart = new CartController();
    }
}

export default Controllers