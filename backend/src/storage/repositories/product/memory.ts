import { Product } from "../../../core/product/model";
import ProductRepository, {
    CreateProductCMD, 
    FilterProduct, 
    UpdateProductCMD 
} from "../../../core/product/repository";
import MemorySettings from "../../settings/memory";

import uuid from "../../utils/uuid";

class ProductMemoryRepository extends ProductRepository {

    private items: Product[];
    
    constructor(settings: MemorySettings) {
        super();

        this.items = [];
    }
    
    async find(id: String): Promise<Product> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('product not found');

        return result;
    }

    async search(filter: FilterProduct): Promise<Product[]> {
        return this.items.filter(item => {
            if (filter.ids && !filter.ids.includes(item.id)) return false;
            if (filter.name && item.name !== filter.name) return false;
            if (filter.code && item.code !== filter.code) return false;
            if (filter.price_min && item.price < filter.price_min) return false;
            if (filter.price_max && item.price > filter.price_max) return false;
            if (filter.stock_min && item.stock < filter.stock_min) return false;
            if (filter.stock_max && item.stock > filter.stock_max) return false;
            
            return true;
        })
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        const product: Product = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        this.items.push(product);

        this.events.create.notify(product);
        
        return product;
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const productUpdated = {
            ...(await this.find(id)),
            ...cmd
        }

        this.items = this.items.map(item => item.id === id ? productUpdated : item);

        this.events.update.notify(productUpdated);

        return productUpdated;
    }

    async delete(id: string): Promise<Product> {
        const product = await this.find(id);

        this.items = this.items.filter(item => item.id !== id);

        return product;
    }

}

export default ProductMemoryRepository;