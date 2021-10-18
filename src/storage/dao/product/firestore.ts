import firebase from 'firebase';

import { CreateProductCMD, FilterProductCMD, ProductDAO, ProductDTO, UpdateProductCMD } from '../../../core/product/dao';

import FirestoreSettings from '../../settings/firestore';
import uuid from '../../utils/uuid';

class ProductFirestoreRepository implements ProductDAO {

    private readonly settings: FirestoreSettings;
    private readonly collectionName: string;

    constructor(settings: FirestoreSettings) {
        this.settings = settings;
        this.collectionName = 'products';
    }

    private get collection(): firebase.firestore.CollectionReference {
        return this.settings.firestore.collection(this.collectionName);
    }

    async find(id: string): Promise<ProductDTO> {
        const productRef = await this.collection.doc(id).get();
        if (!productRef || !productRef.exists) throw new Error("product not found");

        const productData = productRef.data() || {};
        const product: ProductDTO = {
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
    
    async search(filter: FilterProductCMD): Promise<ProductDTO[]> {
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

    async create(cmd: CreateProductCMD): Promise<ProductDTO> {
        const product: ProductDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        await this.collection.doc(product.id).set(product);

        return product;
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<ProductDTO> {
        const update = {
            ...(await this.find(id)),
            ...cmd
        }

        await this.collection.doc(id).set(update)

        return update;
    }

    async delete(id: string): Promise<ProductDTO> {
        const product = await this.find(id);

        await this.collection.doc(id).delete();

        return product;
    }
}

export default ProductFirestoreRepository;