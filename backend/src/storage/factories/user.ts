import BuilderSettings from "./settings";

import { UserDAO } from "../../core/user/dao";

import CartFileRepository from "../dao/user/file";
import CartMemoryRepository from "../dao/user/memory";
import CartMongooseRepository from "../dao/user/mongoose";

import FileSettings from "../settings/file";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";

class UserDAOFactory {

    public static dao: UserDAO;

    private static readonly repositories: {[key:string]: (settings: any) => Promise<UserDAO>} = {
        memory: async (settings: MemorySettings) => {
            const dao = new CartMemoryRepository(settings);
            await dao.setup();
            return dao;
        },
        file: async (settings: FileSettings) => new CartFileRepository(settings),
        mongoose: async (settings: MongooseSettings) => {
            const dao = new CartMongooseRepository(settings);
            await dao.setup();
            return dao;
        }
    }

    static async build(settings: BuilderSettings): Promise<UserDAO> {
        const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
    
        const builder = this.repositories[type];
        if (!builder) throw new Error('invalid settings');

        this.dao = await builder(settings[type]);

        return this.dao;
    }

}

export default UserDAOFactory;