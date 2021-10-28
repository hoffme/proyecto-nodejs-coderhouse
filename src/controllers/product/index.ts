import { Product, CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "../../models/product";

import Controller from "../controller";

class ProductsController extends Controller {

    async search(filter: FilterProductCMD): Promise<Product[]> {
        return Controller.secureMethod(async () => {
            return await Product.search(filter);
        });
    }

    async find(id: string): Promise<Product> {
        return Controller.secureMethod(async () => {        
            return await Product.getById(id) 
        });
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        return Controller.secureMethod(async () => {
            return await Product.create(cmd); 
        });
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        return Controller.secureMethod(async () => {
            const product = await Product.getById(id);
            await product.update(cmd);
            return product; 
        });
    }

    async delete(id: string): Promise<Product> {
        return Controller.secureMethod(async () => {
            const product = await Product.getById(id);
            await product.delete();
            return product;
        });
    }
}

export default ProductsController;