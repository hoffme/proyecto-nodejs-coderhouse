import ProductsController from "./product";
import CartController from "./cart";

import ProductRepositoryBuilder from "../storage/builders/product";
import CartRepositoryBuilder from "../storage/builders/cart";

import ControllerSettings from "./settings";

class Controllers {

    static products: ProductsController;
    static cart: CartController;

    static async setup(settings: ControllerSettings) {
        const productRepository = await ProductRepositoryBuilder(settings.product);
        Controllers.products = new ProductsController(productRepository);
        
        const cartRepository = await CartRepositoryBuilder(productRepository, settings.cart);        
        Controllers.cart = new CartController(cartRepository);
    }
}

export default Controllers