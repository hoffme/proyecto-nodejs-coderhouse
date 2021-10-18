import knex, { Knex } from 'knex';

import uuid from '../../utils/uuid';

import KnexSettings from '../../settings/knex';

import { CreateProductCMD, FilterProductCMD, ProductDAO, ProductDTO, UpdateProductCMD } from '../../../core/product/dao';

class ProductsKnexRepository implements ProductDAO {

    private readonly tableName: string;
    private readonly settings: KnexSettings;

    constructor(settings: KnexSettings) {
        this.tableName = 'products';
        this.settings = settings;
    }

    async execute<T>(commands: (connection: Knex<any, unknown[]>) => Promise<T>): Promise<T> {
        const connection = knex(this.settings.connection);

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
                async (table: any) => {
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

    async create(cmd: CreateProductCMD): Promise<ProductDTO> {
        const product: ProductDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        await this.execute(async conn => {
            await conn.table(this.tableName).insert(product);
        })

        return product;
    }

    async find(id: string): Promise<ProductDTO> {
        const rows = await this.execute<ProductDTO[]>(async conn => {
            return await conn.table(this.tableName).select("*").where("id", id).limit(1);
        })

        if (rows.length === 0) throw new Error('product not found');

        return rows[0];
    }

    async search(filter: FilterProductCMD): Promise<ProductDTO[]> {
        return await this.execute<ProductDTO[]>(async conn => {
            let query = conn.table(this.tableName).select("*");
            
            if (filter.ids) query = query.where("id IN", filter.ids)
            if (filter.name) query = query.where("name", filter.name);
            if (filter.code) query = query.where("code", filter.code);
            if (filter.price_min) query = query.where("price", ">=", filter.price_min);
            if (filter.price_max) query = query.where("price", "<", filter.price_max);
            if (filter.stock_min) query = query.where("stock", ">=", filter.stock_min);
            if (filter.stock_max) query = query.where("stock", "<", filter.stock_max);
            if (filter.stock_zero) query = query.where("stock", "=", 0);

            return await query;
        })
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<ProductDTO> {
        const result = await this.execute<ProductDTO>(async conn => {
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

        return result;
    }

    async delete(id: string): Promise<ProductDTO> {
        const result = await this.execute<ProductDTO>(async conn => {
            const results = await conn.table(this.tableName).select("*").where("id", id).limit(1);
            const product = results[0];
            if (!product) return undefined;

            await conn.table(this.tableName).where('id', id).del();
            
            return product;
        })
        if (!result) {
            throw new Error('product not found');
        }

        return result;
    }
}

export default ProductsKnexRepository;