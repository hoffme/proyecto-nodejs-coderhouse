import CartRepository from "../../core/cart/repository";
import ProductRepository from "../../core/product/repository";

import CartFileRepository from "../repositories/cart/file";
import CartFirestoreRepository from "../repositories/cart/firestore";
import CartsKnexRepository from "../repositories/cart/knex";
import CartMemoryRepository from "../repositories/cart/memory";
import CartMongooseRepository from "../repositories/cart/mongoose";

import firebase from 'firebase';

type CartRepositoryType = 'memory' | 'file' | 'mongoose' | 'knex' | 'firebase';

const CartRepositoryBuilder = async (products: ProductRepository, type: CartRepositoryType): Promise<CartRepository> => {
    const builders: {[key:string]: () => CartRepository} = {
        memory: () => new CartMemoryRepository(products),
        file: () => new CartFileRepository(products, './datos/cart.json'),
        mongoose: () => new CartMongooseRepository(products, { uri: '', options: {} }),
        knex: () => new CartsKnexRepository(products, {}),
        firebase: () => new CartFirestoreRepository(products, firebase.firestore())
    }

    const repository = builders[type]();

    await repository.setup();

    return repository;
}

export default CartRepositoryBuilder;
export type { CartRepositoryType };