import EventCore from "../core/generics/events";

import { Product } from "../core/product/model";
import ProductRepository, { 
    CreateProductCMD, 
    FilterProduct, 
    UpdateProductCMD 
} from "../core/product/repository";

class ProductsController {

    private repository: ProductRepository

    public readonly events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    }

    constructor(repository: ProductRepository) {
        this.repository = repository;

        this.events = {
            create: this.repository.events.create,
            update: this.repository.events.update,
            delete: this.repository.events.delete,
        }
    }

    async search(filter: FilterProduct): Promise<Product[]> {
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