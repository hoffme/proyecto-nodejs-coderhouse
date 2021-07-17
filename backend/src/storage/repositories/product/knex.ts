import knex, { Knex } from 'knex';
import uuid from '../../utils/uuid';

import EventCore from '../../../core/generics/events';
import { Product } from '../../../core/product/model';
import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';

import KnexConnection from '../../connections/knex';

class ProductsKnexRepository implements ProductRepository {

    private readonly tableName: string;
    private readonly connection: KnexConnection;

    public readonly events: {
        create: EventCore<Product>
        update: EventCore<Product>
        delete: EventCore<Product>
    } 

    constructor(connection: KnexConnection) {
        this.tableName = 'products';
        this.connection = connection;

        this.events = {
            create: new EventCore('create'),
            update: new EventCore('update'),
            delete: new EventCore('detele')
        }
    }

    async execute<T>(commands: (connection: Knex<any, unknown[]>) => Promise<T>): Promise<T> {
        const connection = knex(this.connection);

        try {
            return await commands(connection)
        } finally {
            await connection.destroy()
        }
    }

    async setup() {
        await this.execute(async conn => {
            const existTable = await conn.schema.hasTable(this.tableName);
            if (existTable) return;

            await conn.schema.createTable(
                this.tableName,
                async (table) => {
                    table.string('id')
                    table.dateTime('timestamp')
                    table.string('name')
                    table.string('description')
                    table.string('code')
                    table.string('picture')
                    table.float('price')
                    table.float('stock')
                }
            );
        });
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        const product: Product = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        await this.execute(async conn => {
            await conn.table(this.tableName).insert(product);
        })

        this.events.create.notify(product);

        return product;
    }

    async find(id: string): Promise<Product> {
        const rows = await this.execute<Product[]>(async conn => {
            return await conn.table(this.tableName).select("*").where("id", id).limit(1);
        })

        if (rows.length === 0) throw new Error('product not found');

        return rows[0];
    }

    async search(filter: FilterProduct): Promise<Product[]> {
        return await this.execute<Product[]>(async conn => {
            let query = conn.table(this.tableName).select("*");
            if (filter.query) query.where("name LIKE %?%", filter.query);
            return await query;
        })
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const result = await this.execute<Product>(async conn => {
            const results = await conn.table(this.tableName).select("*").where("id", id).limit(1);
            const product = results[0];
            if (!product) return undefined;

            const productUpdated = { ...product, ...cmd };

            await conn.table(this.tableName).update(productUpdated).where('id', id);
            
            return productUpdated;
        })
        if (!result) {
            throw new Error('product not found');
        }

        this.events.update.notify(result);

        return result;
    }

    async delete(id: string): Promise<Product> {
        const result = await this.execute<Product>(async conn => {
            const results = await conn.table(this.tableName).select("*").where("id", id).limit(1);
            const product = results[0];
            if (!product) return undefined;

            await conn.table(this.tableName).where('id', id).del();
            
            return product;
        })
        if (!result) {
            throw new Error('product not found');
        }

        this.events.delete.notify(result);

        return result;
    }
}

export default ProductsKnexRepository;