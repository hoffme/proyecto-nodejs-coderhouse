import {
    DAOFileSettings, 
    DAOMemorySettings, 
    DAOMongoSettings
} from "../../models/storage/settings";

import DAOFactory from "../../models/storage/factory";

import { MessageDAO } from "../../models/message";

import MessageFileDAO from "../dao/message/file";
import MessageMemoryDAO from "../dao/message/memory";
import MessageMongooseDAO from "../dao/message/mongoose";

class MessageDAOFactory extends DAOFactory<MessageDAO> {

    protected async buildMemory(settings: DAOMemorySettings): Promise<MessageDAO> {
        return new MessageMemoryDAO(settings);
    }

    protected async buildFile(settings: DAOFileSettings): Promise<MessageDAO> {
        const dao = new MessageFileDAO(settings);
        await dao.setup();
        return dao;
    }

    protected async buildMongo(settings: DAOMongoSettings): Promise<MessageDAO> {
        const dao = new MessageMongooseDAO(settings);
        await dao.setup();
        return dao;
    }
    
}

export default MessageDAOFactory;