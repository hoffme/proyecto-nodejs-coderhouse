import { DAOMemorySettings } from '../../../models/storage/settings';

import { CreateProductCMD, FilterProductCMD, ProductDAO, ProductDTO, UpdateProductCMD } from '../../../models/product/dao';

import uuid from "../../utils/uuid";

class ProductMemoryRepository implements ProductDAO {

    private items: ProductDTO[];
    
    constructor(settings: DAOMemorySettings) {
        this.items = [];
    }
    
    async find(id: String): Promise<ProductDTO> {
        const result = this.items.find(item => item.id === id);
        if (!result) throw new Error('product not found');

        return result;
    }

    async search(filter: FilterProductCMD): Promise<ProductDTO[]> {
        return this.items.filter(item => {
            if (filter.ids && !filter.ids.includes(item.id)) return false;
            if (filter.name && item.name !== filter.name) return false;
            if (filter.code && item.code !== filter.code) return false;
            if (filter.price_min && item.price < filter.price_min) return false;
            if (filter.price_max && item.price > filter.price_max) return false;
            if (filter.stock_min && item.stock < filter.stock_min) return false;
            if (filter.stock_max && item.stock > filter.stock_max) return false;
            
            return true;
        })
    }

    async create(cmd: CreateProductCMD): Promise<ProductDTO> {
        const product: ProductDTO = {
            id: uuid(),
            timestamp: new Date(),
            ...cmd
        }

        this.items.push(product);
        
        return product;
    }

    async update(id: string, cmd: UpdateProductCMD): Promise<ProductDTO> {
        const productUpdated = {
            ...(await this.find(id)),
            ...cmd
        }

        this.items = this.items.map(item => item.id === id ? productUpdated : item);

        return productUpdated;
    }

    async delete(id: string): Promise<ProductDTO> {
        const product = await this.find(id);

        this.items = this.items.filter(item => item.id !== id);

        return product;
    }

}

export default ProductMemoryRepository;