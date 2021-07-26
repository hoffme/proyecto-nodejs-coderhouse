import knex, { Knex } from 'knex';

import uuid from '../../utils/uuid';
import KnexSettings from '../../settings/knex';

import ProductRepository from '../../../core/product/repository';
import CartRepository, { CartFilter, CartRepositoryItem, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';

class CartsKnexRepository extends CartRepository {
    
    private readonly tables: { cart: string, item: string }
    private readonly settings: KnexSettings;

    constructor(products: ProductRepository, settings: KnexSettings) {
        super(products);

        this.tables = { cart: 'carts', item: 'items_carts' }
        this.settings = settings;
    }

    async execute<T>(commands: (settings: Knex<any, unknown[]>) => Promise<T>): Promise<T> {
        const settings = knex(this.settings.connection);

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
                        table.string('id').primary()
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
                        table.float('count')
                        table.foreign('cart_id')
                            .references('id')
                            .inTable(this.tables.cart)
                    }
                );
            }
        });
    }

    protected async _find(id: String): Promise<CartRepositoryItem> {
        const cart = await this.execute<CartRepositoryItem | undefined>(async (conn) => {
            const carts = await conn(this.tables.cart).select('*').where('id', id)
            const items = await conn(this.tables.item).select('*').where('cart_id', id);

            if (carts.length === 0) return undefined;

            const cart = carts[0];

            const cartItem: CartRepositoryItem = {
                id: cart.id,
                user_id: cart.user_id,
                timestamp: cart.timestamp,
                items_ref: items.map(item => {
                    return {
                        product_id: item.product_id,
                        count: item.count
                    }
                })
            }

            return cartItem;
        })

        if (!cart) throw new Error('cart not found');

        return cart;
    }

    protected async _search(filter: CartFilter): Promise<CartRepositoryItem[]> {
        const carts = await this.execute<CartRepositoryItem[]>(async (conn) => {
            let query = conn(this.tables.cart).select('*')
            if (filter.user_id) query = query.where('user_id', filter.user_id);
            const carts = await query;
            
            const items = await conn(this.tables.item).select('*').whereIn('cart_id', carts.map(cart => cart.id));

            const cartsMap = carts.reduce((result, cart) => {
                result[cart.id] = {
                    id: cart.id,
                    user_id: cart.user_id,
                    timestamp: cart.timestamp,
                    items_ref: []
                }

                return result;
            }, {});

            items.forEach(item => {
                const cart = cartsMap[item.cart_id];
                if (!cart) return;

                cart.items_ref.push(item);
            })

            return Object.values(cartsMap);
        })

        return carts;
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
        const cart = await this.execute<CartRepositoryItem | undefined>(async (conn): Promise<CartRepositoryItem | undefined> => {
            await conn.table(this.tables.item).where('cart_id', id).delete();

            const rows = await conn.table(this.tables.cart).where('id', id).limit(1);

            const cart = rows[0];

            const cartItem: CartRepositoryItem = {
                id: cart.id,
                user_id: cart.user_id,
                timestamp: cart.timestamp,
                items_ref: []
            }

            return cartItem;
        })
        if (!cart) throw new Error('cart not found');

        return cart
    }

    protected async _setItem(id: string, item: ItemRepository): Promise<ItemRepository> {
        await this.execute(async conn => {
            const itemRaw = {
                cart_id: id,
                product_id: item.product_id,
                count: item.count
            }

            const items = await conn(this.tables.item)
                .select('*')
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