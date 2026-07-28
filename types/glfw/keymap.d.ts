type KeyMapItem = {
    label: string;
    code: number;
    /** 0 - standard, 1 - left, 2 - right, 3 - numpad */
    location: number;
};
export declare const keymap: Map<number, KeyMapItem>;
export {};
