import ProductRepository from "../models/product/repository";
import Product, { CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "../models/product/model";

class ProductsController {

    private readonly repository: ProductRepository = new ProductRepository();

    async search(filter: FilterProductCMD): Promise<Product[]> {
        return await this.repository.search(filter);
    }

    async find(id: string): Promise<Product> {
        return await this.repository.find(id) 
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        return await this.repository.create(cmd); 
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        return await this.repository.update(id, cmd); 
    }

    async delete(id: string): Promise<Product> {
        return await this.repository.delete(id)
    }
}

export default ProductsController;