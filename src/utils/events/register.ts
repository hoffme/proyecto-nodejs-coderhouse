import { Listener, Dispath } from "./listener";

class EventRegister<V, R = void> {

    private readonly listeners: Map<Dispath<V, R>, Listener<V, R>>;

    constructor(listeners: Map<Dispath<V, R>, Listener<V, R>>) {
        this.listeners = listeners;
    }

    public listen(dispath: Dispath<V, R>, order: number = 0) {
        this.listeners.set(dispath, { dispath, order });
    }

    public remove(dispath: Dispath<V, R>) {
        this.listeners.delete(dispath);    
    }

}

export default EventRegister;