import { Product, CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "../../models/product";

class ProductsController {

    async search(filter: FilterProductCMD): Promise<Product[]> {
        return await Product.search(filter);
    }

    async find(id: string): Promise<Product> {
        return await Product.getById(id) 
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        return await Product.create(cmd); 
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const product = await Product.getById(id);
        await product.update(cmd);
        return product; 
    }

    async delete(id: string): Promise<Product> {
        const product = await Product.getById(id);
        await product.delete();
        return product;
    }
}

export default ProductsController;