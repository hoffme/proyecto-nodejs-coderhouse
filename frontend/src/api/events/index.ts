interface Listener<V> {
    order?: number
    dispath: (v: V) => Promise<void>
}

class EventCore<V> {

    private listeners: Listener<V>[] = [];

    public addListener(listener: Listener<V>) {
        if (!listener.order) listener.order = 0;
        this.listeners.push(listener);
    }

    public remListener(remove: Listener<V>) {
        this.listeners = this.listeners.filter(listener => listener !== remove)
    }

    public async notify(value: V): Promise<void> {
        await Promise.all(this.listeners.map(listener => listener.dispath(value)))    
    }
}

export default EventCore;
export type { Listener };