import { EventManager } from "../../utils/events";

interface CoreError {
    message: string
    trace: any
    raw: any
}

class ErrorManager {

    private static readonly events = {
        error: new EventManager<CoreError>()
    }

    public static get on() {
        return {
            error: this.events.error.register
        }
    }

    public static async public(error: CoreError) {
        await ErrorManager.events.error.notify(error);
    }

}

export default ErrorManager;
export type { CoreError };