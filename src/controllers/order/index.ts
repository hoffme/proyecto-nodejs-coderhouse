import { Order, FilterOrderCMD } from '../../models/order';

import Controller from '../controller';

class OrderController extends Controller {

    @Controller.method()
    async search(filter: FilterOrderCMD): Promise<Order[]> {
        return await Order.search(filter);
    }

    @Controller.method()
    async get(id: string): Promise<Order> {
        return await Order.getById(id);
    }
}

export default OrderController;