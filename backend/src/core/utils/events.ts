interface Listener<T> {
    id: string
    dispatch: (value: T) => void
    order?: number
}

class EventCore<T> {

    public readonly name: string;
    private readonly listeners: Map<string, Listener<T>>;

    constructor(name: string) {
        this.name = name;
        this.listeners = new Map();
    }

    public setListener(listener: Listener<T>) {
        if (!listener.order) listener.order = 0;
        this.listeners.set(listener.id, listener);
    }

    public removeListener(id: string) {
        this.listeners.delete(id);
    }

    public async notify(value: T): Promise<void> {
        const listeners = Array.from(this.listeners.values()).sort((a, b) => {
            return -((a.order ? a.order : 0) - (b.order ? b.order : 0));
        });

        await Promise.all(listeners.map(listener => {
            return listener.dispatch(value);
        }))
    }
}

export default EventCore;
export type { Listener };