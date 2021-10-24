import {
    DAOFileSettings, 
    DAOMemorySettings, 
    DAOMongoSettings
} from "../../models/storage/settings";

import DAOFactory from "../../models/storage/factory";

import { OrderDAO } from "../../models/order";

import OrderFileDAO from "../dao/order/file";
import OrderMemoryDAO from "../dao/order/memory";
import OrderMongooseDAO from "../dao/order/mongoose";

class OrderDAOFactory extends DAOFactory<OrderDAO> {

    protected async buildMemory(settings: DAOMemorySettings): Promise<OrderDAO> {
        return new OrderMemoryDAO(settings);
    }

    protected async buildFile(settings: DAOFileSettings): Promise<OrderDAO> {
        const dao = new OrderFileDAO(settings);
        await dao.setup();
        return dao;
    }

    protected async buildMongo(settings: DAOMongoSettings): Promise<OrderDAO> {
        const dao = new OrderMongooseDAO(settings);
        await dao.setup();
        return dao;
    }
    
}

export default OrderDAOFactory;