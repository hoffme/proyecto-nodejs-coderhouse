import { Product } from "../product/model";

interface Item {
    product_id: string
    product: Product | undefined
    count: number
}

interface Cart {
    id: string
    user_id: string
    timestamp: Date
    items: Item[]
}

export type { 
    Cart,
    Item
}