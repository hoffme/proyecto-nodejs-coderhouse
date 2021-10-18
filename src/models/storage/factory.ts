import DAOFactorySettings, { DAOFileSettings, DAOMemorySettings, DAOMongoSettings } from "./settings";

abstract class DAOFactory<T> {

    public dao?: T;

    protected abstract buildMemory(settings: DAOMemorySettings): Promise<T>;
    protected abstract buildFile(settings: DAOFileSettings): Promise<T>;
    protected abstract buildMongo(settings: DAOMongoSettings): Promise<T>;

    public async build(settings: DAOFactorySettings): Promise<T> {
        switch (settings.select) {
            case 'memory': {
                this.dao = await this.buildMemory(settings.memory);
                break;
            }
            case 'file': {
                this.dao = await this.buildFile(settings.file);
                break;
            }
            case 'mongo': {
                this.dao = await this.buildMongo(settings.mongo);
                break;
            }
        }
        
        if (!this.dao) throw new Error('cannot build dao');
    
        return this.dao;
    }

}

export default DAOFactory;