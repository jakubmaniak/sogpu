export interface EventListener {
    (ev: any): void;
}


export class EventTarget {
    private _listeners = new Map<string, Set<EventListener>>();

    addEventListener(type: string, listener: any) {
        let pool = this._listeners.get(type);
        if (!pool) {
            pool = new Set();
            this._listeners.set(type, pool);
        }

        pool.add(listener);
    }

    removeEventListener(type: string, listener: any) {
        this._listeners.get(type)?.delete(listener);
    }

    dispatchEvent(type: any): boolean;
    dispatchEvent(type: string, event: any): boolean;
    dispatchEvent(type: any, event?: any) {
        if (typeof type != 'string') {
            event = type;
            type = event.type;
        }

        event.type = type;
        event.target ??= this;
        event.currentTarget = this;
        event.eventPhase = 2;
        event.timeStamp = performance.now();

        this._listeners.get(type)?.forEach((cb) => cb.call(this, event));

        return true;
    }
}