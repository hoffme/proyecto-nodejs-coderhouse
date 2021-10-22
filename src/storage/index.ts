import User from "../models/user/model";
import Product from "../models/product/model";
import Cart from "../models/cart/model";
import Order from "../models/order/model";

import ProductDAOFactory from "./factories/product";
import CartDAOFactory from "./factories/cart";
import UserDAOFactory from "./factories/user";
import OrderDAOFactory from "./factories/order";

import UserRepository from "../models/user/repository";
import ProductRepository from "../models/product/repository";
import CartRepository from "../models/cart/repository";
import OrderRepository from "../models/order/repository";

import StorageSettings from "./settings";

class Storage {

    public static readonly repositories = {
        user: new UserRepository(),
        product: new ProductRepository(),
        cart: new CartRepository(),
        order: new OrderRepository()
    }

    private static readonly factories = {
        user: new UserDAOFactory(),
        product: new ProductDAOFactory(),
        cart: new CartDAOFactory(),
        order: new OrderDAOFactory()
    }

    public static async setup(settings: StorageSettings): Promise<void> {
        const userDAO = await this.factories.user.build(settings.user);
        const productDAO = await this.factories.product.build(settings.product);
        const cartDAO = await this.factories.cart.build(settings.cart);
        const orderDAO = await this.factories.order.build(settings.order);

        User.setDAO(userDAO);
        Product.setDAO(productDAO);
        Cart.setDAO(cartDAO);
        Order.setDAO(orderDAO);
    }

}

export default Storage;