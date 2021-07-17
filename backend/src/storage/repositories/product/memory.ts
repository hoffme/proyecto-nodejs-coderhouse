import EventCore from "../../../core/generics/events";
import { Product } from "../../../core/product/model";
import ProductRepository, {
    CreateProductCMD, 
    FilterProduct, 
    UpdateProductCMD 
} from "../../../core/product/repository";

import uuid from "../../utils/uuid";

class ProductMemoryRepository implements ProductRepository {

    private items: Product[];

    public readonly events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    }
    
    constructor() {
        this.items = [];
        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            delete: new EventCore('delete')
        }
    }
    
    async find(id: String): Promise<Product> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('product not found');

        return result;
    }

    async search(filter: FilterProduct): Promise<Product[]> {
        return this.items.filter(item => {
            if (filter.query && item.name.toLowerCase().includes(filter.query.toLowerCase())) return true;
            
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