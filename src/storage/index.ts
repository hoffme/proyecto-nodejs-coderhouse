import User from "../models/user/model";
import Product from "../models/product/model";
import Cart from "../models/cart/model";
import Order from "../models/order/model";
import Message from "../models/message/model";

import ProductDAOFactory from "./factories/product";
import CartDAOFactory from "./factories/cart";
import UserDAOFactory from "./factories/user";
import OrderDAOFactory from "./factories/order";
import MessageDAOFactory from "./factories/message";

import UserRepository from "../models/user/repository";
import ProductRepository from "../models/product/repository";
import CartRepository from "../models/cart/repository";
import OrderRepository from "../models/order/repository";
import MessageRepository from "../models/message/repository";

import StorageSettings from "./settings";

class Storage {

    public static readonly repositories = {
        user: new UserRepository(),
        product: new ProductRepository(),
        cart: new CartRepository(),
        order: new OrderRepository(),
        message: new MessageRepository()
    }

    private static readonly factories = {
        user: new UserDAOFactory(),
        product: new ProductDAOFactory(),
        cart: new CartDAOFactory(),
        order: new OrderDAOFactory(),
        message: new MessageDAOFactory()
    }

    public static async setup(settings: StorageSettings): Promise<void> {
        const userDAO = await this.factories.user.build(settings.user);
        const productDAO = await this.factories.product.build(settings.product);
        const cartDAO = await this.factories.cart.build(settings.cart);
        const orderDAO = await this.factories.order.build(settings.order);
        const messageDAO = await this.factories.message.build(settings.message);

        User.setDAO(userDAO);
        Product.setDAO(productDAO);
        Cart.setDAO(cartDAO);
        Order.setDAO(orderDAO);
        Message.setDAO(messageDAO);
    }

}

export default Storage;