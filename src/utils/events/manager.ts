import { Listener, Dispath } from "./listener";
import EventRegister from "./register";

class EventManager<V, R = void> {

    public readonly register: EventRegister<V, R>;

    private readonly listeners: Map<Dispath<V, R>, Listener<V, R>>;

    constructor() {
        this.listeners = new Map();
        this.register = new EventRegister(this.listeners);
    }

    public async notify(value: V): Promise<R[]> {
        const listeners = Array.from(this.listeners.values());
        const ordersListenes = listeners.sort((a, b) => a.order - b.order);

        return Promise.all<R>(ordersListenes.map(l => l.dispath(value)));
    }

}

export default EventManager;