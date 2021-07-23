import { CartRepositoryType } from "../storage/builders/cart";
import { ProductRepositoryType } from "../storage/builders/product";

interface ControllerSettings {
    product: {
        type: ProductRepositoryType
    },
    cart: {
        type: CartRepositoryType
    }
}

export default ControllerSettings;