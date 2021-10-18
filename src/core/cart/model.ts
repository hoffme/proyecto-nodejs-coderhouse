import EventCore from "../generics/events";

import Product from "../product/model";

import { CartDAO, CartDTO, CreateCartCMD, FilterCartCMD, ItemDTO, UpdateCartCMD } from "./dao";

interface Item {
    product: Product
    quantity: number
}

class Cart {

    private static dao: CartDAO;

    public static readonly events = {
        create: new EventCore<Cart>('create'),
        update: new EventCore<Cart>('update'),
        delete: new EventCore<Cart>('delete')
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

    public async items(): Promise<Item[]> {
        const products = await Product.search({ ids: this.items_ref.map(item => item.product_id) });
        
        const quantities = Object.fromEntries(this._data.items_ref.map(item => [item.product_id, item.count]))
        
        return products.map(product => ({ product, quantity: quantities[product.id] || 0 }));
    }

    public get deleted(): boolean { return this._deleted }

    public async update(fields: UpdateCartCMD): Promise<void> {
        this._data = await Cart.dao.update(this._data.id, fields);
    
        Cart.events.update.notify(this);
    }

    public async setItem(product_id: string, count: number): Promise<void> {
        await Cart.dao.setItem(this._data.id, { product_id, count });

        this._data = await Cart.dao.find(this._data.id);
    
        Cart.events.update.notify(this);
    }

    public async remItem(productId: string): Promise<void> {
        await Cart.dao.remItem(this._data.id, productId);

        this._data = await Cart.dao.find(this._data.id);
    
        Cart.events.update.notify(this);
    }

    public async clear(): Promise<void> {
        await Cart.dao.clear(this._data.id);
        this._deleted = true;
    
        Cart.events.delete.notify(this);
    }

}

export default Cart;
export type {
    Item,
    CreateCartCMD,
    UpdateCartCMD,
    FilterCartCMD,
    ItemDTO
}