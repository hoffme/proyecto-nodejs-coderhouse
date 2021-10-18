import User from "../models/user/model";
import Product from "../models/product/model";
import Cart from "../models/cart/model";

import ProductDAOFactory from "./factories/product";
import CartDAOFactory from "./factories/cart";
import UserDAOFactory from "./factories/user";

import UserRepository from "../models/user/repository";
import ProductRepository from "../models/product/repository";
import CartRepository from "../models/cart/repository";

import StorageSettings from "./settings";

class Storage {

    public static readonly repositories = {
        user: new UserRepository(),
        product: new ProductRepository(),
        cart: new CartRepository()
    }

    private static readonly factories = {
        user: new UserDAOFactory(),
        product: new ProductDAOFactory(),
        cart: new CartDAOFactory()
    }

    public static async setup(settings: StorageSettings): Promise<void> {
        const userDAO = await this.factories.user.build(settings.user);
        const productDAO = await this.factories.product.build(settings.product);
        const cartDAO = await this.factories.cart.build(settings.cart);

        User.setDAO(userDAO);
        Product.setDAO(productDAO);
        Cart.setDAO(cartDAO);
    }

}

export default Storage;