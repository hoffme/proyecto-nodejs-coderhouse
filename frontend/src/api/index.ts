import FetchManager from "./fetch";

import Services, { ServiceCTX } from "./services/services";

class API {

    public static readonly instance: API = new API();

    private readonly _ctx: ServiceCTX;
    private readonly _services: Services;
    
    private constructor() {
        this._ctx = this.createCTX();
        this._services = this.createServices();
    }

    private createCTX(): ServiceCTX {
        return { fetch: new FetchManager() }
    }

    private createServices(): Services {
        const services: Services = {
        }

        return services;
    }

    public get services(): Services { return this._services }
}

export default API;