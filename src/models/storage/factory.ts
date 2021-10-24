import DAOFactorySettings, { DAOFileSettings, DAOMemorySettings, DAOMongoSettings } from "./settings";

abstract class DAOFactory<T> {

    public settings?: DAOFactorySettings;

    private dao?: T;

    protected abstract buildMemory(settings: DAOMemorySettings): Promise<T>;
    protected abstract buildFile(settings: DAOFileSettings): Promise<T>;
    protected abstract buildMongo(settings: DAOMongoSettings): Promise<T>;

    public setSettings(settings: DAOFactorySettings) {
        this.settings = settings;
    }

    public async build(): Promise<T> {
        if (!this.settings) throw new Error('dao factory settings not loaded');

        let dao: T;

        switch (this.settings.select) {
            case 'memory': {
                dao = await this.buildMemory(this.settings.memory);
                break;
            }
            case 'file': {
                dao = await this.buildFile(this.settings.file);
                break;
            }
            case 'mongo': {
                dao = await this.buildMongo(this.settings.mongo);
                break;
            }
        }
        
        if (!dao) throw new Error('cannot build dao');

        return dao;
    }

    public async instance(): Promise<T> {
        if (!this.dao) this.dao = await this.build();

        return this.dao;
    }

}

export default DAOFactory;