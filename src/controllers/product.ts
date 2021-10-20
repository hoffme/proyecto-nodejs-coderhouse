import Storage from "../storage";

import Product, { CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "../models/product/model";

class ProductsController {

    async search(filter: FilterProductCMD): Promise<Product[]> {
        return await Storage.repositories.product.search(filter);
    }

    async find(id: string): Promise<Product> {
        return await Storage.repositories.product.find(id) 
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        return await Storage.repositories.product.create(cmd); 
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        return await Storage.repositories.product.update(id, cmd); 
    }

    async delete(id: string): Promise<Product> {
        return await Storage.repositories.product.delete(id)
    }
}

export default ProductsController;