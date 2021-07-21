import firebase from 'firebase';

import { Product } from '../../../core/product/model';

import ProductRepository, { CreateProductCMD, FilterProduct, UpdateProductCMD } from '../../../core/product/repository';
import uuid from '../../utils/uuid';

class ProductFirestoreRepository extends ProductRepository {

    private readonly firestore: firebase.firestore.Firestore;
    private readonly collectionName: string;

    constructor(firestore: firebase.firestore.Firestore, collectionName: string) {
        super();
        
        this.firestore = firestore;
        this.collectionName = collectionName;
    }

    private get collection(): firebase.firestore.CollectionReference {
        return this.firestore.collection(this.collectionName);
    }

    async find(id: string): Promise<Product> {
        const productRef = await this.collection.doc(id).get();
        if (!productRef || !productRef.exists) throw new Error("product not found");

        const productData = productRef.data() || {};
        const product: Product = {
            id: productRef.id,
            timestamp: productData.timestamp, 
            name: productData.name, 
            description: productData.description, 
            code: productData.code, 
            picture: productData.picture, 
            price: productData.price, 
            stock: productData.stock, 
        }

        return product;
    }
    
    async search(filter: FilterProduct): Promise<Product[]> {
        let query = this.collection.where("id", "!=", null);

        if (filter.ids) query = query.where("id", "in", filter.ids)
        if (filter.name) query = query.where("name", "==", filter.name)
        if (filter.code) query = query.where("code", "==", filter.code)
        if (filter.price_min) query = query.where("price", ">=", filter.price_min)
        if (filter.price_max) query = query.where("price", "<", filter.price_max)
        if (filter.stock_min) query = query.where("stock", ">=", filter.stock_min)
        if (filter.stock_max) query = query.where("stock", "<", filter.stock_max)
        if (filter.stock_zero) query = query.where("stock", "==", 0)

        const snapshots = await query.get();

        return snapshots.docs.map(productRef => {
            const productData = productRef.data();

            return {
                id: productRef.id,
                timestamp: productData.timestamp, 
                name: productData.name, 
                description: productData.description, 
                code: productData.code, 
                picture: productData.picture, 
                price: productData.price, 
                stock: productData.stock, 
            }
        });
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