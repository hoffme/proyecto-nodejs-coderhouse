import BuilderSettings from "./settings";

import CartRepository from "../../core/cart/repository";
import ProductRepository from "../../core/product/repository";

import CartFileRepository from "../repositories/cart/file";
import CartFirestoreRepository from "../repositories/cart/firestore";
import CartsKnexRepository from "../repositories/cart/knex";
import CartMemoryRepository from "../repositories/cart/memory";
import CartMongooseRepository from "../repositories/cart/mongoose";

import FileSettings from "../settings/file";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";
import KnexSettings from "../settings/knex";
import FirestoreSettings from "../settings/firestore";

const CartRepositoryBuilder = async (products: ProductRepository, settings: BuilderSettings): Promise<CartRepository> => {
    const builders: {[key:string]: (settings: any) => CartRepository} = {
        memory: (settings: MemorySettings) => new CartMemoryRepository(products, settings),
        file: (settings: FileSettings) => new CartFileRepository(products, settings),
        mongoose: (settings: MongooseSettings) => new CartMongooseRepository(products, settings),
        knex: (settings: KnexSettings) => new CartsKnexRepository(products, settings),
        firebase: (settings: FirestoreSettings) => new CartFirestoreRepository(products, settings)
    }

    const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
    
    const builder = builders[type];
    if (!builder) throw new Error('invalid settings');

    const repository = builder(settings[type]);

    await repository.setup();

    return repository;
}

export default CartRepositoryBuilder;