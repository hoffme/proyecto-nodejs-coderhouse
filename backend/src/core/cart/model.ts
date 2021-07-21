import { Product } from "../product/model";

interface Item {
    count: number
    product: Product
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