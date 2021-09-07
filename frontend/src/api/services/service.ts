import { ServiceCTX } from "./services";

abstract class Service {
        
    public ctx: ServiceCTX

    constructor(ctx: ServiceCTX) { this.ctx = ctx }
}

export default Service;