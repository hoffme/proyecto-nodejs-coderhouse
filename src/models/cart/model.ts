import { EventManager } from "../../utils/events";

import Product from "../product/model";

import { AddressDTO, CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from "./dao";

interface Item {
    product: Product
    quantity: number
}

class Cart {

    private static dao: CartDAO;

    private static readonly events = {
        create: new EventManager<Cart>(),
        update: new EventManager<Cart>(),
        delete: new EventManager<Cart>()
    }

    public static get on() {
        return {
            create: this.events.create.register,
            update: this.events.update.register,
            delete: this.events.delete.register
        }
    }
    
    private _data: CartDTO;
    private _deleted: boolean;

    public static async getById(id: string): Promise<Cart> {
        const dto = await Cart.dao.find(id);
        return new Cart(dto);
    }

    public static async search(filter: FilterCartCMD): Promise<Cart[]> {
        const dtos = await Cart.dao.search(filter);
        return dtos.map(dto => new Cart(dto));
    }

    public static async create(fields: CreateCartCMD): Promise<Cart> {
        const dto = await Cart.dao.create(fields);
        const product = new Cart(dto);
    
        Cart.events.create.notify(product);

        return product;
    }

    public static setDAO(dao: CartDAO) {
        this.dao = dao;
    }

    private constructor(data: CartDTO) {
        this._data = data;
        this._deleted = false;
    }

    public get id(): string { return this._data.id } 
    public get user_id(): string { return this._data.user_id }
    public get timestamp(): Date { return this._data.timestamp }
    public get items_ref(): ItemDTO[] { return this._data.items_ref }
    public get address(): AddressDTO { return this._data.address }
    public get cost(): number { return this._data.total }

    public async items(): Promise<Item[]> {
        const products = await Product.search({ ids: this.items_ref.map(item => item.product_id) });
        
        const quantities = Object.fromEntries(this._data.items_ref.map(item => [item.product_id, item.quantity]))
        
        return products.map(product => ({ product, quantity: quantities[product.id] || 0 }));
    }

    public get deleted(): boolean { return this._deleted }

    public async setAddress(address: AddressDTO): Promise<void> {
        this._data.address = address;

        await this.update();
    }

    public async setItem(product_id: string, quantity: number): Promise<void> {
        const product = await Product.getById(product_id);
        const total = product.price * quantity;

        const item: ItemDTO = { product_id, quantity, total };

        let added = false;
        this._data.items_ref = this._data.items_ref.map(item => {
            if (item.product_id !== item.product_id) return item;
            
            added = true;
            return item;
        })

        if (!added) this._data.items_ref.push(item);

        this._data.total = this._data.items_ref.reduce((total, item) => total + item.total, 0);

        await this.update();
    }

    public async clear(): Promise<void> {
        this._data.items_ref = [];
        this._data.address = { city: '', zip_code: '', street: '', number: '', indications: '' };
        this._data.total = 0;

        await this.update();
    }

    public async finish(): Promise<void> {
        
    }

    private async update(): Promise<void> {
        await Cart.dao.update(this._data.id, {
            items_ref: this._data.items_ref,
            address: this._data.address,
            total: this._data.total
        });

        Cart.events.update.notify(this);
    }

    json(): any { return { ...this._data } }

}

export default Cart;
export type {
    Item,
    CreateCartCMD,
    UpdateCartCMD,
    FilterCartCMD,
    ItemDTO
}