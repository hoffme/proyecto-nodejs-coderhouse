import knex, { Knex } from 'knex';

import uuid from '../../utils/uuid';
import KnexConnection from '../../connections/knex';

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
    private readonly connection: KnexConnection;

    constructor(products: ProductRepository, connection: KnexConnection) {
        super(products);

        this.tables = { cart: 'carts', item: 'items_carts' }
        this.connection = connection;
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
}

export default CartsKnexRepository;