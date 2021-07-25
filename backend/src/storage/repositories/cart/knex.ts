import knex, { Knex } from 'knex';

import uuid from '../../utils/uuid';
import KnexSettings from '../../settings/knex';

import ProductRepository from '../../../core/product/repository';
import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';

interface CartItemsRaw {
    id: string
    user_id: string
    timestamp: Date
    cart_id: string
    product_id: string
    count: number
}

class CartsKnexRepository extends CartRepository {
    
    private readonly tables: { cart: string, item: string }
    private readonly settings: KnexSettings;

    constructor(products: ProductRepository, settings: KnexSettings) {
        super(products);

        this.tables = { cart: 'carts', item: 'items_carts' }
        this.settings = settings;
    }

    async execute<T>(commands: (settings: Knex<any, unknown[]>) => Promise<T>): Promise<T> {
        const settings = knex(this.settings);

        try {
            return await commands(settings)
        } finally {
            await settings.destroy()
        }
    }

    async setup() {
        await this.execute(async conn => {
            const existTableCart = await conn.schema.hasTable(this.tables.cart);
            if (!existTableCart) {
                await conn.schema.createTable(
                    this.tables.cart,
                    async (table: any) => {
                        table.string('id')
                        table.dateTime('timestamp')
                        table.string('user_id')
                    }
                );
            }

            const extisTableItem = await conn.schema.hasTable(this.tables.item);
            if (!extisTableItem) {
                await conn.schema.createTable(
                    this.tables.item,
                    async (table: any) => {
                        table.string('cart_id')
                        table.string('product_id')
                        table.number('count')
                    }
                );
            }
        });
    }

    protected async _find(id: String): Promise<CartRepositoryItem> {
        const rows = await this.execute<CartItemsRaw[]>(async (conn) => {
            const cartID = this.tables.cart+'.id';
            const itemCartID = this.tables.item+'.cart_id';

            return await conn(this.tables.cart)
                .where(cartID, id)
                .join(
                    this.tables.item, 
                    cartID,
                    itemCartID
                )
        })

        if (rows.length === 0) throw new Error('cart not found');

        const carts = rows.reduce<{[key:string]: CartRepositoryItem}>((carts, cart) => {
            if (!carts[cart.id]) {
                carts[cart.id] = {
                    id: cart.id,
                    timestamp: cart.timestamp,
                    user_id: cart.user_id,
                    items_ref: []
                }
            }

            carts[cart.id].items_ref.push(
                { product_id: cart.product_id, count: cart.count }
            );

            return carts;
        }, {});

        return Object.values(carts)[0];
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        const rows = await this.execute<CartItemsRaw[]>(async (conn) => {
            const cartID = this.tables.cart+'.id';
            const itemCartID = this.tables.item+'.cart_id';

            let query = conn(this.tables.cart)
            
            if (filter.user_id) query = query.where('user_id', filter.user_id);

            query = query.join(this.tables.item, cartID, itemCartID)

            return await query;
        })

        const carts = rows.reduce<{[key:string]: CartRepositoryItem}>((carts, cart) => {
            if (!carts[cart.id]) {
                carts[cart.id] = {
                    id: cart.id,
                    timestamp: cart.timestamp,
                    user_id: cart.user_id,
                    items_ref: []
                }
            }

            carts[cart.id].items_ref.push(
                { product_id: cart.product_id, count: cart.count }
            );

            return carts;
        }, {});

        return Object.values(carts);
    }

    protected async _create(cmd: CreateCartCMD): Promise<CartRepositoryItem> {
        const cart: CartRepositoryItem = {
            id: uuid(),
            timestamp: new Date(),
            items_ref: [],
            ...cmd
        }

        await this.execute(async conn => {
            await conn.table(this.tables.cart).insert({
                id: cart.id,
                timestamp: cart.timestamp,
                user_id: cart.user_id
            });
        })

        return cart;
    }

    protected async _update(id: string, cmd: UpdateCartCMD): Promise<CartRepositoryItem> {
        const cart = await this._find(id);

        await this.execute<void>(async conn => {
            await conn.table(this.tables.cart).update(cmd).where('id', id);
        })

        const result: CartRepositoryItem = {
            ...cart,
            ...cmd
        }

        return result;
    }

    protected async _clear(id: string): Promise<CartRepositoryItem> {
        const row = await this.execute<CartItemsRaw | undefined>(async (conn): Promise<CartItemsRaw | undefined> => {
            await conn.table(this.tables.item).where('cart_id', id).delete();

            const rows: CartItemsRaw[] = await conn.table(this.tables.cart).where('id', id).limit(1);

            return rows[0];
        })
        if (!row) throw new Error('cart not found');

        return {
            id: row.id,
            user_id: row.user_id,
            timestamp: row.timestamp,
            items_ref: [] 
        }
    }

    protected async _setItem(id: string, item: ItemRepository): Promise<ItemRepository> {
        await this.execute(async conn => {
            const itemRaw = {
                cart_id: id,
                product_id: item.product_id,
                count: item.count
            }

            const items = await conn(this.tables.item)
                .select('id')
                .where('cart_id', itemRaw.cart_id)
                .where('product_id', itemRaw.product_id)
        
            if (items.length > 0) {
                await conn.table(this.tables.item)
                    .update(itemRaw)
                    .where('cart_id', itemRaw.cart_id)
                    .where('product_id', itemRaw.product_id)
            } else {
                await conn.table(this.tables.item).insert(itemRaw);
            }
        })

        return item;
    }

    protected async _remItem(id: string, product_id: string): Promise<ItemRepository> {
        const result = await this.execute<ItemRepository | undefined>(async conn => {
            const results = await conn.table(this.tables.item)
                .select("*")
                .where("cart_id", id)
                .where("product_id", product_id)
                .limit(1);

            const item = results[0];
            if (!item) return undefined;

            await conn.table(this.tables.item)
                .where("cart_id", id)
                .where("product_id", product_id)
                .del();
            
            return item;
        })
        if (!result) throw new Error('product not found');

        return result;
    }
}

export default CartsKnexRepository;