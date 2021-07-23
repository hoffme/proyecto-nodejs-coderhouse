import ProductRepository from "../../core/product/repository";

import ProductFileRepository from "../repositories/product/file";
import ProductFirestoreRepository from "../repositories/product/firestore";
import ProductsKnexRepository from "../repositories/product/knex";
import ProductMemoryRepository from "../repositories/product/memory";
import ProductMongooseRepository from "../repositories/product/mongoose";

import firebase from 'firebase';

type ProductRepositoryType = 'memory' | 'file' | 'mongoose' | 'knex' | 'firebase';

const ProductRepositoryBuilder = async (type: ProductRepositoryType): Promise<ProductRepository> => {
    const builders: {[key:string]: () => ProductRepository} = {
        memory: () => new ProductMemoryRepository(),
        file: () => new ProductFileRepository('./datos/product.json'),
        mongoose: () => new ProductMongooseRepository({ uri: '', options: {} }),
        knex: () => new ProductsKnexRepository({}),
        firebase: () => new ProductFirestoreRepository(firebase.firestore())
    }

    const repository = builders[type]();

    await repository.setup();

    return repository;
}

export default ProductRepositoryBuilder;
export type { ProductRepositoryType }