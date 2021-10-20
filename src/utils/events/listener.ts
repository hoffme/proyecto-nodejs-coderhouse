type Dispath<V, R> = (v: V) => (Promise<R> | R)

interface Listener<V, R> {
    order: number
    dispath: Dispath<V, R>
}

export type {
    Listener,
    Dispath
};