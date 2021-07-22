import ProductsController from "./product";
import CartController from "./cart";
import ProductStoreBuilder from "../storage/stores/cart";
import CartStoreBuilder from "../storage/stores/product";

class Controllers {
    static products: ProductsController;
    static cart: CartController;

    static async setup() {
        const productStore = new ProductStoreBuilder();
        await productStore.setRepository('memory');

        const cartStore = new CartStoreBuilder(productStore.repository());
        cartStore.setRepository('memory');

        Controllers.products = new ProductsController(productStore.repository());
        Controllers.cart = new CartController(cartStore.repository(), Controllers.products);
    }
}

export default Controllers