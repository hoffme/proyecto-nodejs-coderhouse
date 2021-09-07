import ProductsController from "./product";
import CartController from "./cart";
import UserController from "./user";

import ProductRepositoryBuilder from "../storage/builders/product";
import CartRepositoryBuilder from "../storage/builders/cart";
import UserRepositoryBuilder from "../storage/builders/user";

import ControllerSettings from "./settings";

class Controllers {

    static user: UserController;
    static products: ProductsController;
    static cart: CartController;

    static async setup(settings: ControllerSettings) {
        const userRepository = await UserRepositoryBuilder(settings.user);
        Controllers.user = new UserController(userRepository)

        const productRepository = await ProductRepositoryBuilder(settings.product);
        Controllers.products = new ProductsController(productRepository);
        
        const cartRepository = await CartRepositoryBuilder(productRepository, settings.cart);        
        Controllers.cart = new CartController(cartRepository);
    }
}

export default Controllers