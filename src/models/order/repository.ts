import Order, { CreateOrderCMD, FilterOrderCMD } from "./model";

class OrderRepository {
    
    public async find(id: string): Promise<Order> {
        return Order.getById(id);
    }

    public async search(filter: FilterOrderCMD): Promise<Order[]> {
        return Order.search(filter);
    }

    public async create(fields: CreateOrderCMD): Promise<Order> {
        return Order.create(fields);
    }
    
}

export default OrderRepository;
export type {
    FilterOrderCMD,
    CreateOrderCMD
}