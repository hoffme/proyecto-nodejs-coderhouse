import CartRepository, { CartFilter, CreateCartCMD, ItemRepository, UpdateCartCMD } from '../../../core/cart/repository';
import ProductRepository from '../../../core/product/repository';

import FileStorage from '../../connections/file';

class CartFileRepository extends CartRepository {
    
    private file: FileStorage<{[id: string]: CartRepository}>

    constructor(products: ProductRepository, path: string) {
        super(products);

        this.file = new FileStorage(path);
    }
    
    async setup() {
        try { await this.file.get() } 
        catch (e) { await this.file.set({}) }
    }

    protected _find(id: String): Promise<CartRepository> {
        throw new Error('Method not implemented.');
    }
    protected _search(filter: CartFilter): Promise<CartRepository[]> {
        throw new Error('Method not implemented.');
    }
    protected _create(cmd: CreateCartCMD): Promise<CartRepository> {
        throw new Error('Method not implemented.');
    }
    protected _update(id: string, cmd: UpdateCartCMD): Promise<CartRepository> {
        throw new Error('Method not implemented.');
    }
    protected _setItem(id: string, item: ItemRepository): Promise<ItemRepository> {
        throw new Error('Method not implemented.');
    }
}

export default CartFileRepository;