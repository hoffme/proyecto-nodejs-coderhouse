import BuilderSettings from "./settings";

import { CartDAO } from "../../models/cart/dao";

import CartFileDAO from "../dao/cart/file";
import CartMemoryDAO from "../dao/cart/memory";
import CartMongooseDAO from "../dao/cart/mongoose";

import FileSettings from "../settings/file";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";

class CartDAOFactory {

    public static dao: CartDAO;

    private static readonly repositories: {[key:string]: (settings: any) => Promise<CartDAO>} = {
        memory: async (settings: MemorySettings) => new CartMemoryDAO(settings),
        file: async (settings: FileSettings) => {
            const dao = new CartFileDAO(settings);
            await dao.setup();
            return dao;
        },
        mongoose: async (settings: MongooseSettings) => {
            const dao = new CartMongooseDAO(settings);
            await dao.setup();
            return dao;
        }
    }

    public static async build(settings: BuilderSettings): Promise<CartDAO> {
        const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
        
        const builder = this.repositories[type];
        if (!builder) throw new Error('invalid settings');
    
        this.dao = await builder(settings[type]);
    
        return this.dao;
    }

}

export default CartDAOFactory;