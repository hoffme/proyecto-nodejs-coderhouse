import ProductsController from "./product";
import CartController from "./cart";

import ProductRepository from "../core/product/repository";
import CartRepository from "../core/cart/repository";

import ProductMemoryRepository from "../storage/repositories/product/memory";
import CartMemoryRepository from "../storage/repositories/cart/memory";

class Controllers {

    private static productRepository: ProductRepository;
    static products: ProductsController;

    private static cartRepository: CartRepository;
    static cart: CartController;

    private static async setupProduct() {
        Controllers.productRepository = new ProductMemoryRepository();
        await Controllers.productRepository.setup();

        Controllers.products = new ProductsController(Controllers.productRepository);
    }

    private static async setupCart() {
        Controllers.cartRepository = new CartMemoryRepository(Controllers.productRepository);
        await Controllers.cartRepository.setup();
        
        Controllers.cart = new CartController(Controllers.cartRepository);
    }

    static async setup() {
        await Controllers.setupProduct();
        await Controllers.setupCart();
    }
}

export default Controllers