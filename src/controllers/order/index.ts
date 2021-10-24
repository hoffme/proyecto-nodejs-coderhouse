import { Order, FilterOrderCMD } from '../../models/order';

class OrderController {

    async search(filter: FilterOrderCMD): Promise<Order[]> {
        return await Order.search(filter);
    }

    async get(id: string): Promise<Order> {
        return await Order.getById(id);
    }

}

export default OrderController;