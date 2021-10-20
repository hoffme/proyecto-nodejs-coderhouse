import { EventManager } from "../../utils/events";

import { CreateProductCMD, FilterProductCMD, ProductDAO, ProductDTO, UpdateProductCMD } from "./dao";

class Product {

    private static dao: ProductDAO;

    public static readonly events = {
        create: new EventManager<Product>(),
        update: new EventManager<Product>(),
        delete: new EventManager<Product>()
    }

    public static get on() {
        return {
            create: this.events.create.register,
            update: this.events.update.register,
            delete: this.events.delete.register
        }
    }
    
    private _data: ProductDTO;
    private _deleted: boolean;

    public static async getById(id: string): Promise<Product> {
        const dto = await Product.dao.find(id);
        return new Product(dto);
    }

    public static async search(filter: FilterProductCMD): Promise<Product[]> {
        const dtos = await Product.dao.search(filter);
        return dtos.map(dto => new Product(dto));
    }

    public static async create(fields: CreateProductCMD): Promise<Product> {
        const dto = await Product.dao.create(fields);
        const product = new Product(dto);
    
        Product.events.create.notify(product);

        return product;
    }

    public static setDAO(dao: ProductDAO) {
        this.dao = dao;
    }

    private constructor(data: ProductDTO) {
        this._data = data;
        this._deleted = false;
    }

    public get id(): string { return this._data.id }
    public get timestamp(): Date { return this._data.timestamp }
    public get name(): string { return this._data.name }
    public get description(): string { return this._data.description }
    public get code(): string { return this._data.code }
    public get picture(): string { return this._data.picture }
    public get price(): number { return this._data.price }
    public get stock(): number { return this._data.stock }

    public get deleted(): boolean { return this._deleted }

    public async update(fields: UpdateProductCMD): Promise<void> {
        this._data = await Product.dao.update(this._data.id, fields);
    
        Product.events.update.notify(this);
    }

    public async delete(): Promise<void> {
        await Product.dao.delete(this._data.id);
        this._deleted = true;
    
        Product.events.delete.notify(this);
    }

}

export default Product;
export type {
    CreateProductCMD,
    FilterProductCMD,
    UpdateProductCMD
}