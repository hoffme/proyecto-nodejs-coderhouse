import EventCore from '../../../core/generics/events';
import { Product } from '../../../core/product/model';
import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';

import FileStorage from '../../connections/file';

import uuid from '../../utils/uuid';

class ProductFileRepository implements ProductRepository {

    private file: FileStorage<{[id: string]: Product}>

    public readonly events: {
        create: EventCore<Product>,
        update: EventCore<Product>,
        delete: EventCore<Product>
    }

    constructor(path: string) {
        this.file = new FileStorage(path);

        this.events = {
            create: new EventCore("create"),
            update: new EventCore("update"),
            delete: new EventCore("delete")
        }
    }
    
    async setup() {
        try {
            await this.file.get();
        } catch (e) {
            await this.file.set({});
        }
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