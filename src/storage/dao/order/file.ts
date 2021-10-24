import { DAOFileSettings } from '../../../models/storage/settings';

import { OrderDAO, OrderDTO, CreateOrderCMD, FilterOrderCMD, UpdateOrderCMD } from '../../../models/order';

import FileStorage from '../../../utils/file';
import uuid from '../../../utils/uuid';

class OrderFileDAO implements OrderDAO {
    
    private file: FileStorage<{[id: string]: OrderDTO}>

    constructor(setting: DAOFileSettings) {
        this.file = new FileStorage(setting.path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch (e) { await this.file.set({}) }
    }

    async find(id: string): Promise<OrderDTO> {
        const items = await this.file.get();

        const Order = items[id];
        if (!Order) throw new Error('Order not found');

        return Order;
    }

    async search(filter: FilterOrderCMD): Promise<OrderDTO[]> {
        const items = await this.file.get();

        return Object.values(items).filter(item => {
            if (filter.user_id && filter.user_id != item.user.id) return false; 
            
            return true;
        })
    }

    async create(cmd: CreateOrderCMD): Promise<OrderDTO> {
        const Order: OrderDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        const items = await this.file.get();
        items[Order.id] = Order;

        await this.file.set(items);

        return Order;
    }

    async update(id: string, update: UpdateOrderCMD): Promise<OrderDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('Order not found');
        
        items[id] = { ...(items[id]), ...update }
    
        await this.file.set(items);

        return items[id];
    }

    async delete(id: string): Promise<OrderDTO> {
        const items = await this.file.get();
        if (!items[id]) throw new Error('Order not found');
        
        const model = items[id];
        delete items[id];

        await this.file.set(items);

        return model;
    }
}

export default OrderFileDAO;