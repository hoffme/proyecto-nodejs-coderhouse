import { Product, CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "../../models/product";

import Controller from "../controller";

class ProductsController extends Controller {

    @Controller.method()
    async search(filter: FilterProductCMD): Promise<Product[]> {
        return await Product.search(filter);
    }

    @Controller.method()
    async find(id: string): Promise<Product> {
        return await Product.getById(id) 
    }

    @Controller.method()
    async create(cmd: CreateProductCMD): Promise<Product> {
        return await Product.create(cmd); 
    }

    @Controller.method()
    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const product = await Product.getById(id);
        await product.update(cmd);
        return product; 
    }

    @Controller.method()
    async delete(id: string): Promise<Product> {
        const product = await Product.getById(id);
        await product.delete();
        return product;
    }
}

export default ProductsController;