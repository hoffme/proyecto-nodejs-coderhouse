import { Product } from "../core/product/model";
import { Cart } from "../core/cart/model";

import ProductsController from "./product";
import CartController from "./cart";

// import MemoryRepository from "../storage/repositories/memory";
import FileRepository from "../storage/repositories/file";

class Controllers {
    static products: ProductsController;
    static cart: CartController;

    static async setup() {
        // const productsRepository = new MemoryRepository<Product>();
        // Controllers.products = new ProductsController(productsRepository);
        
        const productsRepository = new FileRepository<Product>('datos/products.db');
        await productsRepository.setup();
        Controllers.products = new ProductsController(productsRepository);

        // const cartRepository = new MemoryRepository<Cart>();
        // Controllers.cart = new CartController(cartRepository, Controllers.products);

        const cartRepository = new FileRepository<Cart>('datos/cart.db');
        await cartRepository.setup();
        Controllers.cart = new CartController(cartRepository, Controllers.products);
    }
}

export default Controllers