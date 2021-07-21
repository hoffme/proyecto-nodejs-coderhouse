import { Product } from '../../../core/product/model';
import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';

import FileStorage from '../../connections/file';

import uuid from '../../utils/uuid';

class ProductFileRepository extends ProductRepository {

    private file: FileStorage<{[id: string]: Product}>

    constructor(file: FileStorage<{[id: string]: Product}>) {
        super();

        this.file = file;
    }
    
    async setup() {
        try { await this.file.get() } 
        catch { await this.file.set({}) }
    }

    async find(id: string): Promise<Product> {
        const items = await this.file.get();
        
        const product = items[id];
        if (!product) throw new Error(`product not found`);
        
        return product;
    }
    
    async search(filter: FilterProduct): Promise<Product[]> {
        const items = await this.file.get();

        return Object.values(items).filter(item => {
            if (filter.ids && !filter.ids.includes(item.id)) return false;
            if (filter.name && item.name !== filter.name) return false;
            if (filter.code && item.code !== filter.code) return false;
            if (filter.price_min && item.price < filter.price_min) return false;
            if (filter.price_max && item.price > filter.price_max) return false;
            if (filter.stock_min && item.stock < filter.stock_min) return false;
            if (filter.stock_max && item.stock > filter.stock_max) return false;
            if (filter.stock_zero && item.stock != 0) return false; 

            return true;
        })
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        const product: Product = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        const items = await this.file.get();
        items[product.id] = product;

        await this.file.set(items);

        this.events.create.notify(product)

        return product;
    }

    async update(id: string, update: UpdateProductCMD): Promise<Product> {
        const items = await this.file.get();
        items[id] = { ...(items[id]), ...update };

        await this.file.set(items);

        this.events.update.notify(items[id])

        return items[id];
    }

    async delete(id: string): Promise<Product> {
        const items = await this.file.get();

        const model = items[id];

        delete items[id];

        await this.file.set(items);

        this.events.delete.notify(model)

        return model;
    }
}

export default ProductFileRepository;