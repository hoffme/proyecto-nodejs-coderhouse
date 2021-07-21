import CartRepository from "./repository";

interface CartStore {
    setRepository(type: string): Promise<CartRepository>
    repository(): CartRepository
}

export default CartStore;