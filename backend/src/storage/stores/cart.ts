import ProductRepository from "../../core/product/repository";
import ProductStore from "../../core/product/store";
import KnexConnection from "../connections/knex";
import MongooseConnection from "../connections/mongoose";
import ProductFileRepository from "../repositories/product/file";
import ProductFirestoreRepository from "../repositories/product/firestore";
import ProductsKnexRepository from "../repositories/product/knex";
import ProductMemoryRepository from "../repositories/product/memory";
import ProductMongooseRepository from "../repositories/product/mongoose";
import firebase from 'firebase';
import FileStorage from "../connections/file";

interface ProductBuilderSettings {
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

class ProductStoreBuilder implements ProductStore {

    private _repository: ProductRepository | undefined;

    public settings: ProductBuilderSettings = {}

    private _memoryBuild(): ProductRepository {
        return new ProductMemoryRepository();
    }

    private _fileBuild(): ProductRepository {
        if (!this.settings.file) throw new Error('not setting load');

        return new ProductFileRepository(
            new FileStorage(this.settings.file.path)
        );
    }

    private _mongooseBuild(): ProductRepository {
        if (!this.settings.mongoose) throw new Error('not setting load');
        
        return new ProductMongooseRepository(
            this.settings.mongoose.connection
        )
    }

    private _firestoreBuild(): ProductRepository {
        if (!this.settings.firestore) throw new Error('not setting load');

        return new ProductFirestoreRepository(
            this.settings.firestore.app,
            this.settings.firestore.collectionName
        )
    }

    private _knexBuild(): ProductRepository {
        if (!this.settings.knex) throw new Error('not setting load');

        return new ProductsKnexRepository(
            this.settings.knex.connection
        )
    }
    
    async setRepository(type: 'memory' | 'file' | 'mongoose' | 'firestore' | 'knex'): Promise<ProductRepository> {
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

    repository(): ProductRepository {
        if (!this._repository) throw new Error('not setting repository');
        return this._repository
    }
}

export default ProductStoreBuilder;