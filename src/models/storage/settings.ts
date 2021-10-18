interface DAOMemorySettings {}

interface DAOFileSettings {
    path: string
}

interface DAOMongoSettings {
    uri: string,
    options: {
        dbName?: string;
        user?: string;
        pass?: string;
    }
}

type StorageMethods = 'memory' | 'file' | 'mongo';

interface DAOFactorySettings {
    select: StorageMethods
    memory: DAOMemorySettings
    file: DAOFileSettings
    mongo: DAOMongoSettings
}

export default DAOFactorySettings;
export type {
    StorageMethods,
    DAOMemorySettings,
    DAOFileSettings,
    DAOMongoSettings
}