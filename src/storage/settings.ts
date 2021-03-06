import DAOFactorySettings from "../models/storage/settings";

interface StorageSettings {
    product: DAOFactorySettings
    cart: DAOFactorySettings
    user: DAOFactorySettings
    order: DAOFactorySettings
    message: DAOFactorySettings
}

export default StorageSettings;