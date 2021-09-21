import BuilderSettings from "./settings";

import UserRepository from "../../core/user/repository";

import CartFileRepository from "../repositories/user/file";
import CartMemoryRepository from "../repositories/user/memory";
import CartMongooseRepository from "../repositories/user/mongoose";

import FileSettings from "../settings/file";
import MemorySettings from "../settings/memory";
import MongooseSettings from "../settings/mongoose";

class UserRepositoryFactory {

    public static repository: UserRepository;

    private static readonly repositories: {[key:string]: (settings: any) => UserRepository} = {
        memory: (settings: MemorySettings) => new CartMemoryRepository(settings),
        file: (settings: FileSettings) => new CartFileRepository(settings),
        mongoose: (settings: MongooseSettings) => new CartMongooseRepository(settings)
    }

    static async build(settings: BuilderSettings): Promise<UserRepository> {
        const type: keyof BuilderSettings = (Object.keys(settings) as Array<keyof typeof settings>)[0];
    
        const builder = this.repositories[type];
        if (!builder) throw new Error('invalid settings');

        const repository = builder(settings[type]);

        await repository.setup();

        this.repository = repository;

        return repository;
    }

}

export default UserRepositoryFactory;