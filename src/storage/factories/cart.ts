import {
    DAOFileSettings, 
    DAOMemorySettings, 
    DAOMongoSettings
} from "../../models/storage/settings";

import DAOFactory from "../../models/storage/factory";

import { CartDAO } from "../../models/cart";

import CartFileDAO from "../dao/cart/file";
import CartMemoryDAO from "../dao/cart/memory";
import CartMongooseDAO from "../dao/cart/mongoose";

class CartDAOFactory extends DAOFactory<CartDAO> {

    protected async buildMemory(settings: DAOMemorySettings): Promise<CartDAO> {
        return new CartMemoryDAO(settings);
    }

    protected async buildFile(settings: DAOFileSettings): Promise<CartDAO> {
        const dao = new CartFileDAO(settings);
        await dao.setup();
        return dao;
    }

    protected async buildMongo(settings: DAOMongoSettings): Promise<CartDAO> {
        const dao = new CartMongooseDAO(settings);
        await dao.setup();
        return dao;
    }
    
}

export default CartDAOFactory;