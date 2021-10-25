import ErrorManager from "../models/error";

class Controller {

    public static method<P extends Array<any>, R>() {
        return (
            target: Object,
            key: string | symbol,
            descriptor: PropertyDescriptor
        ) => {
            const childFunction = descriptor.value;

            descriptor.value = async (args: P): Promise<R> => {
                try {
                    return await childFunction(...args);
                } catch(e: any) {
                    ErrorManager.public({
                        message: e.message,
                        trace: e.trace,
                        raw: e
                    });
                    throw e;
                }
            };

            return descriptor;
        };
    }

}

export default Controller;