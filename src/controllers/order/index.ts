import { Order, FilterOrderCMD } from '../../models/order';

import Controller from '../controller';

class OrderController extends Controller {

    async search(filter: FilterOrderCMD): Promise<Order[]> {
        return Controller.secureMethod(async () => {
            return await Order.search(filter);
        });
    }

    async get(id: string): Promise<Order> {
        return Controller.secureMethod(async () => {
            return await Order.getById(id);
        });
    }
}

export default OrderController;