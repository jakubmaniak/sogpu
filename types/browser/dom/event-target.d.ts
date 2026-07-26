export interface EventListener {
    (ev: any): void;
}
export declare class EventTarget {
    private _listeners;
    addEventListener(type: string, listener: any): void;
    removeEventListener(type: string, listener: any): void;
    dispatchEvent(event: {
        type: string;
    } & Record<string, any>): boolean;
}
