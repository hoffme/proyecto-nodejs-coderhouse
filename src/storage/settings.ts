import DAOFactorySettings from "../models/storage/settings";

interface StorageSettings {
    product: DAOFactorySettings
    cart: DAOFactorySettings
    user: DAOFactorySettings
}

export default StorageSettings;