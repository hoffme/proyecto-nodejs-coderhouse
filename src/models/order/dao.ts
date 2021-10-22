interface FilterOrderCMD {
    user_id?: string
}

type OrderState = 
    'procesando' | 
    'confirmada' | 
    'en camino' | 
    'recivida' | 
    'finalizada' | 
    'cancelada'

interface ItemDTO {
    id: string
    name: string
    unit_price: number
    quantity: number
    total: number
}

interface AddressDTO {
    city: string
    zip_code: string
    street: string
    number: string
    indications: string
}

interface UserDTO {
    id: string
    name: string
    email: string
    phone: string
}

interface CreateOrderCMD {
    state: OrderState
    user: UserDTO
    items: ItemDTO[]
    address: AddressDTO
    total: number
}

interface UpdateOrderCMD {
    state?: OrderState
    user?: UserDTO
    items?: ItemDTO[]
    address?: AddressDTO
    total?: number
}

interface OrderDTO {
    id: string
    timestamp: Date
    state: OrderState
    user: UserDTO
    items: ItemDTO[]
    address: AddressDTO
    total: number
}

interface OrderDAO {
    find(id: String): Promise<OrderDTO>
    search(filter: FilterOrderCMD): Promise<OrderDTO[]>
    create(cmd: CreateOrderCMD): Promise<OrderDTO>
    update(id: string, cmd: UpdateOrderCMD): Promise<OrderDTO>
    delete(id: string): Promise<OrderDTO>
}

export type {
    AddressDTO,
    FilterOrderCMD,
    CreateOrderCMD,
    UpdateOrderCMD,
    OrderState,
    ItemDTO,
    UserDTO,
    OrderDTO,
    OrderDAO
}