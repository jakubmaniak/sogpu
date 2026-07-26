export interface Storage {
    [key: string]: any;
}


export class Storage {
    length = 0;

    getItem(key: string): string | null {
        return this[key] ?? null;
    }

    setItem(key: string, value: any) {
        if (!(key in this)) {
            this.length++;
        }
        this[key] = String(value);
    }

    removeItem(key: string) {
        this[key] = undefined as any;
    }

    key(index: number) {
        return Object.keys(this)[index] ?? null;
    }

    clear() {
        const owned = ['length', 'getItem', 'setItem', 'removeItem', 'key', 'clear'];
        for (const key of Object.keys(this)) {
            if (owned.includes(key)) continue;
            this[key] = undefined;
        }
    }
};