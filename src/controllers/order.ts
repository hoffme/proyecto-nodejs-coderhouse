import Storage from '../storage';

import Order, { FilterOrderCMD } from '../models/order/model';

class OrderController {

    async search(filter: FilterOrderCMD): Promise<Order[]> {
        return await Storage.repositories.order.search(filter);
    }

    async get(id: string): Promise<Order> {
        return await Storage.repositories.order.find(id);
    }

}

export default OrderController;