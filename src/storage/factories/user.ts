import {
    DAOFileSettings, 
    DAOMemorySettings, 
    DAOMongoSettings
} from "../../models/storage/settings";

import DAOFactory from "../../models/storage/factory";

import { UserDAO } from "../../models/user";

import CartFileRepository from "../dao/user/file";
import CartMemoryRepository from "../dao/user/memory";
import CartMongooseRepository from "../dao/user/mongoose";

class UserDAOFactory extends DAOFactory<UserDAO> {

    protected async buildMemory(settings: DAOMemorySettings): Promise<UserDAO> {
        return new CartMemoryRepository(settings);
    }

    protected async buildFile(settings: DAOFileSettings): Promise<UserDAO> {
        const dao = new CartFileRepository(settings);
        await dao.setup();
        return dao;
    }

    protected async buildMongo(settings: DAOMongoSettings): Promise<UserDAO> {
        const dao = new CartMongooseRepository(settings);
        await dao.setup();
        return dao;
    }

}

export default UserDAOFactory;