import Product, { CreateProductCMD, FilterProductCMD, UpdateProductCMD } from "./model";

class ProductRepository {
    
    public async find(id: string): Promise<Product> {
        return Product.getById(id);
    }

    public async search(filter: FilterProductCMD): Promise<Product[]> {
        return Product.search(filter);
    }

    public async create(fields: CreateProductCMD): Promise<Product> {
        return Product.create(fields);
    }

    public async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const product = await Product.getById(id);
        await product.update(cmd);
        return product;
    }

    public async delete(id: string): Promise<Product> {
        const product = await Product.getById(id);
        await product.delete();
        return product;
    }
}

export default ProductRepository;
export type {
    FilterProductCMD,
    CreateProductCMD,
    UpdateProductCMD,
}