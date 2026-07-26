export interface Storage {
    [key: string]: any;
}
export declare class Storage {
    length: number;
    getItem(key: string): string | null;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
    key(index: number): string;
    clear(): void;
}
