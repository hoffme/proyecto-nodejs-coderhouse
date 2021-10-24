import { DAOMemorySettings } from '../../../models/storage/settings';

import { OrderDAO, OrderDTO, CreateOrderCMD, FilterOrderCMD, UpdateOrderCMD } from '../../../models/order';

import uuid from "../../../utils/uuid";

class OrderMemoryDAO implements OrderDAO {
    
    private items: OrderDTO[];
    
    constructor(settings: DAOMemorySettings) {
        this.items = [];
    }
    
    async find(id: String): Promise<OrderDTO> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('Order not found');

        return result;
    }
    
    async search(filter: FilterOrderCMD): Promise<OrderDTO[]> {
        return this.items.filter(item => {
            if (filter.user_id && filter.user_id !== item.user.id) return false;
            
            return true;
        })
    }
    
    async create(cmd: CreateOrderCMD): Promise<OrderDTO> {
        const Order: OrderDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd,
        }

        this.items.push(Order);

        return Order;
    }
    
    async update(id: string, cmd: UpdateOrderCMD): Promise<OrderDTO> {
        const OrderUpdated = {
            ...(await this.find(id)),
            ...cmd
        }

        this.items = this.items.map(item => {
            return item.id === id ? OrderUpdated : item
        })

        return OrderUpdated;
    }
    
    async delete(id: string): Promise<OrderDTO> {
        const Order = await this.find(id);

        this.items = this.items.filter(item => item.id !== id);

        return Order;
    }
}


export default OrderMemoryDAO;