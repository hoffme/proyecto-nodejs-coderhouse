import ProductRepository from "./repository";

interface ProductStore {
    setRepository(type: string): Promise<ProductRepository>
    repository(): ProductRepository
}

export default ProductStore;