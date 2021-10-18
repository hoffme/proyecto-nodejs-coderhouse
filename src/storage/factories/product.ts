import {
    DAOFileSettings, 
    DAOMemorySettings, 
    DAOMongoSettings
} from "../../models/storage/settings";

import DAOFactory from "../../models/storage/factory";

import { ProductDAO } from "../../models/product/dao";

import ProductFileDAO from "../dao/product/file";
import ProductMemoryRepository from "../dao/product/memory";
import ProductMongooseRepository from "../dao/product/mongoose";


class ProductDAOFactory extends DAOFactory<ProductDAO> {
    
    protected async buildMemory(settings: DAOMemorySettings): Promise<ProductDAO> {
        return new ProductMemoryRepository(settings)
    }

    protected async buildFile(settings: DAOFileSettings): Promise<ProductDAO> {
        const dao = new ProductFileDAO(settings);
        await dao.setup();
        return dao;
    }

    protected async buildMongo(settings: DAOMongoSettings): Promise<ProductDAO> {
        const dao = new ProductMongooseRepository(settings);
        await dao.setup();
        return dao;
    }

}

export default ProductDAOFactory;