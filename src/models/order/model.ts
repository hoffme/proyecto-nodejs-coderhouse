import { EventManager } from "../../utils/events";

import Cart from "../cart/model";
import Product from "../product/model";
import User from "../user/model";

import { AddressDTO, CreateOrderCMD, FilterOrderCMD, ItemDTO, OrderDAO, OrderDTO, OrderState, UserDTO } from "./dao";

class Order {

    private static dao: OrderDAO;

    private static readonly events = {
        create: new EventManager<Order>(),
        update: new EventManager<Order>(),
        delete: new EventManager<Order>()
    }

    public static get on() {
        return {
            create: this.events.create.register,
            update: this.events.update.register,
            delete: this.events.delete.register
        }
    }
    
    private _data: OrderDTO;
    private _deleted: boolean;

    public static async getById(id: string): Promise<Order> {
        const dto = await Order.dao.find(id);
        return new Order(dto);
    }

    public static async search(filter: FilterOrderCMD): Promise<Order[]> {
        const dtos = await Order.dao.search(filter);
        return dtos.map(dto => new Order(dto));
    }

    public static async create(fields: CreateOrderCMD): Promise<Order> {
        const dto = await Order.dao.create(fields);
        const product = new Order(dto);
    
        Order.events.create.notify(product);

        return product;
    }

    public static async fromCart(user: User, cart: Cart): Promise<Order> {
        const productsIds = cart.items_ref.map(item => item.product_id)
        const products = await Product.search({ ids: productsIds });
        const productsMap = Object.fromEntries(products.map(product => [product.id, product]));
        
        const items = cart.items_ref.map(item_ref => {
            const product = productsMap[item_ref.product_id];
            if (!product) throw new Error('Error al procesar los productos');

            return {
                id: product.id,
                name: product.name,
                unit_price: product.price,
                quantity: item_ref.quantity, 
                total: item_ref.total
            }
        })

        const userDTO: UserDTO = {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email
        }

        return await Order.create({
            state: 'procesando',
            items,
            user: userDTO,
            address: cart.address,
            total: cart.total
        })
    }

    public static validateState(state: any): OrderState {
        const states = new Set<string>([
            'procesando',
            'confirmada',
            'en camino',
            'recivida',
            'finalizada',
            'cancelada'
        ])

        if (!states.has(state)) {
            throw new Error('invalid state')
        }

        return (state as any);
    }

    public static setDAO(dao: OrderDAO) {
        this.dao = dao;
    }

    private constructor(data: OrderDTO) {
        this._data = data;
        this._deleted = false;
    }

    public get id(): string { return this._data.id } 
    public get timestamp(): Date { return this._data.timestamp }
    public get state(): OrderState { return this._data.state }
    public get user(): UserDTO { return this._data.user }
    public get items(): ItemDTO[] { return this._data.items }
    public get address(): AddressDTO { return this._data.address }
    public get total(): number { return this._data.total }

    public get deleted(): boolean { return this._deleted }

    public async changeAddress(address: AddressDTO): Promise<void> {
        this._data.address = address;
        await this.update();
    }

    public async setState(state: OrderState): Promise<void> {
        this._data.state = state;
        await this.update();
    }

    public async changeItem(product_id: string, quantity: number): Promise<void> {
        const product = await Product.getById(product_id);
        const total = product.price * quantity;

        const newItem: ItemDTO = {
            id: product.id,
            name: product.name,
            unit_price: product.price,
            quantity, 
            total
        };

        let added = false;
        this._data.items = this._data.items.map(item => {
            if (item.id !== newItem.id) return item;
            
            added = true;
            return newItem;
        })

        if (!added) this._data.items.push(newItem);

        this._data.total = this._data.items.reduce((total, item) => total + item.total, 0);

        await this.update();
    }

    private async update(): Promise<void> {
        await Order.dao.update(this._data.id, {
            state: this._data.state,
            user: this._data.user,
            items: this._data.items,
            address: this._data.address,
            total: this._data.total
        });

        Order.events.update.notify(this);
    }

    json(): any { return { ...this._data } }

}

export default Order;
export {
    CreateOrderCMD,
    FilterOrderCMD
}