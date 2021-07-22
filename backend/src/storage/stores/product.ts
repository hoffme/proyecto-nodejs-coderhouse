import CartRepository from "../../core/cart/repository";
import CartStore from "../../core/cart/store";
import ProductRepository from "../../core/product/repository";
import KnexConnection from "../connections/knex";
import MongooseConnection from "../connections/mongoose";
import CartFileRepository from "../repositories/cart/file";
import CartFirestoreRepository from "../repositories/cart/firestore";
import CartsKnexRepository from "../repositories/cart/knex";
import CartMemoryRepository from "../repositories/cart/memory";
import CartMongooseRepository from "../repositories/cart/mongoose";
import firebase from 'firebase';

interface CartBuilderSettings {
    memory?: {}
    file?: { 
        path: string
    }
    mongoose?: {
        connection: MongooseConnection
    }
    firestore?: {
        app: firebase.firestore.Firestore
        collectionName: string
    }
    knex?: {
        connection: KnexConnection
    }
}

class CartStoreBuilder implements CartStore {
    
    private _products: ProductRepository;
    private _repository: CartRepository | undefined;

    public settings: CartBuilderSettings = {}

    constructor(products: ProductRepository) {
        this._products = products;
    }

    private _memoryBuild(): CartRepository {
        return new CartMemoryRepository(
            this._products
        );
    }

    private _fileBuild(): CartRepository {
        if (!this.settings.file) throw new Error('not setting load');

        return new CartFileRepository(
            this._products, 
            this.settings.file.path
        );
    }

    private _mongooseBuild(): CartRepository {
        if (!this.settings.mongoose) throw new Error('not setting load');
        
        return new CartMongooseRepository(
            this._products,
            this.settings.mongoose.connection
        )
    }

    private _firestoreBuild(): CartRepository {
        if (!this.settings.firestore) throw new Error('not setting load');

        return new CartFirestoreRepository(
            this._products,
            this.settings.firestore.app,
            this.settings.firestore.collectionName
        )
    }

    private _knexBuild(): CartRepository {
        if (!this.settings.knex) throw new Error('not setting load');

        return new CartsKnexRepository(
            this._products,
            this.settings.knex.connection
        )
    }
    
    async setRepository(type: 'memory' | 'file' | 'mongoose' | 'firestore' | 'knex'): Promise<CartRepository> {
        const builders = {
            memory: this._memoryBuild,
            file: this._fileBuild,
            mongoose: this._mongooseBuild,
            firestore: this._firestoreBuild,
            knex: this._knexBuild,
        }

        const repository = builders[type]();
        await repository.setup();

        this._repository = repository;

        return this._repository;
    }

    repository(): CartRepository {
        if (!this._repository) throw new Error('not setting repository');
        return this._repository
    }
}

export default CartStoreBuilder;