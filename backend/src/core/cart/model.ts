import { Product } from "../product/model";

interface ProductCount {
    product: Product
    count: number
}

interface Cart {
    id: string
    timestamp: Date
    products: ProductCount[]
}

export type { 
    Cart,
    ProductCount
}