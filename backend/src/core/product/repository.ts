import EventCore from "../generics/events";

import { Product } from "./model";

interface FilterProduct {
    ids?: string[]
    name?: string
    code?: string
    price_min?: number
    price_max?: number
    stock_min?: number,
    stock_max?: number
    stock_zero?: boolean
}

interface CreateProductCMD {
    name: string
    description: string
    code: string
    picture: string
    price: number
    stock: number
}

interface UpdateProductCMD {
    name?: string
    description?: string
    picture?: string
    price?: number
    stock?: number
}

abstract class ProductRepository {
    
    public readonly events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    }

    protected constructor() {
        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            delete: new EventCore('delete')
        }
    }

    abstract find(id: String): Promise<Product>
    abstract search(filter: FilterProduct): Promise<Product[]>
    abstract create(cmd: CreateProductCMD): Promise<Product>
    abstract update(id: string, cmd: UpdateProductCMD): Promise<Product>
    abstract delete(id: string): Promise<Product>
}

export default ProductRepository;
export type {
    FilterProduct,
    CreateProductCMD,
    UpdateProductCMD,
}