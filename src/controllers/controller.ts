import ErrorManager from "../models/error";

class Controller {

    public static async secureMethod<R>(func: () => Promise<R>): Promise<R> {
        try { return await func() } 
        catch(e: any) {
            ErrorManager.public({
                message: e.message,
                trace: e.trace,
                raw: e
            });

            throw e;
        }
    }

}

export default Controller;