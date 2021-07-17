import EventCore from "../generics/events";

import { Product } from "./model";

interface FilterProduct {
    query?: string
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

interface ProductRepository {
    events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    }

    find(id: String): Promise<Product>
    search(filter: FilterProduct): Promise<Product[]>
    create(cmd: CreateProductCMD): Promise<Product>
    update(id: string, cmd: UpdateProductCMD): Promise<Product>
    delete(id: string): Promise<Product>
}

export default ProductRepository;
export type {
    FilterProduct,
    CreateProductCMD,
    UpdateProductCMD,
}