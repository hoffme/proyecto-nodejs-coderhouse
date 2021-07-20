import { Product } from '../../../core/product/model';

import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';
import uuid from '../../utils/uuid';

class ProductFirestoreRepository extends ProductRepository {

    private readonly firestore: firestore.App;
    private readonly collectionName: string;

    constructor(firestore: firestore.App, collectionName: string) {
        super();

        this.firestore = firestore;
        this.collectionName = collectionName;
    }

    private get collection(): firestore.Collection {
        return this.firestore.collection(this.collectionName);
    }

    async find(id: String): Promise<Product> {
        const product =  await this.collection.doc(id);
        if (!product) throw new Error("product not found");

        return product;
    }
    
    async search(filter: FilterProduct): Promise<Product[]> {
        const snapshots = 
            filter.query ? 
            await this.collection.where("nombre", "==", filter.query) :
            await this.collection.get();

        return snapshots.map(doc => doc.data());
    }

    async create(cmd: CreateProductCMD): Promise<Product> {
        const product: Product = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        await this.collection.doc(product.id).set(product);

        this.events.create.notify(product);

        return product;
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<Product> {
        const update = {
            ...(await this.find(id)),
            ...cmd
        }

        await this.collection.doc(id).set(update)

        this.events.update.notify(update);

        return update;
    }

    async delete(id: string): Promise<Product> {
        const product = await this.find(id);

        await this.collection.doc(id).delete();

        this.events.delete.notify(product);

        return product;
    }
}

export default ProductFirestoreRepository;