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

    dispatchEvent(event: { type: string } & Record<string, any>) {
        event.target ??= this;
        event.currentTarget = this;
        event.eventPhase = 0;
        event.timeStamp = performance.now();
        event.preventDefault = function() { };

        this._listeners.get(event.type)?.forEach((cb) => cb.call(this, event));

        return true;
    }
}