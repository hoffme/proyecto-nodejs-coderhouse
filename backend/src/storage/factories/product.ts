import BuilderSettings from "./settings";

import { ProductDAO } from "../../core/product/dao";

import ProductFileDAO from "../dao/product/file";
import ProductFirestoreRepository from "../dao/product/firestore";
import ProductsKnexRepository from "../dao/product/knex";
import ProductMemoryRepository from "../dao/product/memory";
import ProductMongooseRepository from "../dao/product/mongoose";

import MemorySettings from "../settings/memory";
import FileSettings from "../settings/file";
import MongooseSettings from "../settings/mongoose";
import KnexSettings from "../settings/knex";
import FirestoreSettings from "../settings/firestore";

class ProductDAOFactory {

    static dao: ProductDAO;

    private static readonly types: {[key:string]: (settings: any) => Promise<ProductDAO>} = {
        memory: async (settings: MemorySettings) => new ProductMemoryRepository(settings),
        file: async (settings: FileSettings) => {
            const dao = new ProductFileDAO(settings);
            await dao.setup();

            return dao;
        },
        mongoose: async (settings: MongooseSettings) => {
            const dao = new ProductMongooseRepository(settings);
            await dao.setup();

            return dao;
        },
        knex: async (settings: KnexSettings) => {
            const dao = new ProductsKnexRepository(settings);
            await dao.setup();

            return dao;
        },
        firestore: async (settings: FirestoreSettings) => new ProductFirestoreRepository(settings)
    }

    static async build(settings: BuilderSettings): Promise<ProductDAO> {
        const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
    
        const builder = this.types[type];
        if (!builder) throw new Error('invalid settings');

        this.dao = await builder(settings[type]);

        return this.dao;
    }

}

export default ProductDAOFactory;