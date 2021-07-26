import BuilderSettings from "./settings";

import ProductRepository from "../../core/product/repository";

import ProductFileRepository from "../repositories/product/file";
import ProductFirestoreRepository from "../repositories/product/firestore";
import ProductsKnexRepository from "../repositories/product/knex";
import ProductMemoryRepository from "../repositories/product/memory";
import ProductMongooseRepository from "../repositories/product/mongoose";

import MemorySettings from "../settings/memory";
import FileSettings from "../settings/file";
import MongooseSettings from "../settings/mongoose";
import KnexSettings from "../settings/knex";
import FirestoreSettings from "../settings/firestore";

const ProductRepositoryBuilder = async (settings: BuilderSettings): Promise<ProductRepository> => {
    const builders: {[key:string]: (settings: any) => ProductRepository} = {
        memory: (settings: MemorySettings) => new ProductMemoryRepository(settings),
        file: (settings: FileSettings) => new ProductFileRepository(settings),
        mongoose: (settings: MongooseSettings) => new ProductMongooseRepository(settings),
        knex: (settings: KnexSettings) => new ProductsKnexRepository(settings),
        firestore: (settings: FirestoreSettings) => new ProductFirestoreRepository(settings)
    }

    const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
    
    const builder = builders[type];
    if (!builder) throw new Error('invalid settings');

    const repository = builder(settings[type]);

    await repository.setup();

    return repository;
}

export default ProductRepositoryBuilder;