interface FilterProductCMD {
    ids?: string[]
    name?: string
    code?: string
    price_min?: number
    price_max?: number
    stock_min?: number,
    stock_max?: number
    stock_zero?: boolean
}

interface CreateProductCMD {
    name: string
    description: string
    code: string
    picture: string
    price: number
    stock: number
}

interface UpdateProductCMD {
    name?: string
    description?: string
    picture?: string
    price?: number
    stock?: number
}

interface ProductDTO {
    id: string
    timestamp: Date
    name: string
    description: string
    code: string
    picture: string
    price: number
    stock: number
}

interface ProductDAO {
    find(id: String): Promise<ProductDTO>
    search(filter: FilterProductCMD): Promise<ProductDTO[]>
    create(cmd: CreateProductCMD): Promise<ProductDTO>
    update(id: string, cmd: UpdateProductCMD): Promise<ProductDTO>
    delete(id: string): Promise<ProductDTO>
}

export type {
    FilterProductCMD,
    CreateProductCMD,
    UpdateProductCMD,
    ProductDTO,
    ProductDAO
}