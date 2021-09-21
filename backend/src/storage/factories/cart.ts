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

class CartRepositoryFactory {

    public static repository: CartRepository;

    private static readonly repositories: {[key:string]: (products: ProductRepository, settings: any) => CartRepository} = {
        memory: (products: ProductRepository, settings: MemorySettings) => new CartMemoryRepository(products, settings),
        file: (products: ProductRepository, settings: FileSettings) => new CartFileRepository(products, settings),
        mongoose: (products: ProductRepository, settings: MongooseSettings) => new CartMongooseRepository(products, settings),
        knex: (products: ProductRepository, settings: KnexSettings) => new CartsKnexRepository(products, settings),
        firestore: (products: ProductRepository, settings: FirestoreSettings) => new CartFirestoreRepository(products, settings)
    }

    public static async build(products: ProductRepository, settings: BuilderSettings): Promise<CartRepository> {
        const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
        
        const builder = this.repositories[type];
        if (!builder) throw new Error('invalid settings');
    
        const repository = builder(products, settings[type]);
    
        await repository.setup();

        this.repository = repository;
    
        return repository;
    }

}

export default CartRepositoryFactory;