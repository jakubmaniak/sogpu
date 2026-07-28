type KeyMapItem = {
    label: string;
    code: number;
    /** 0 - standard, 1 - left, 2 - right, 3 - numpad */
    location: number;
}


export const keymap = new Map<number, KeyMapItem>([
    key(32, 'Space'),
    key(39, 'Quote', 222),
    key(44, 'Comma', 188),
    key(45, 'Minus', 189),
    key(46, 'Period', 190),
    key(47, 'Slash', 191),
    ...repeat(10, i => key(48 + i, `Digit${i}`)),
    key(59, 'Semicolon', 186),
    key(61, 'Equal', 187),
    ...repeat(26, i => key(65 + i, `Key${String.fromCharCode(65 + i)}`)),
    key(91, 'BracketLeft', 219),
    key(92, 'Backslash', 220),
    key(93, 'BracketRight', 221),
    key(96, 'Backquote', 192),
    key(161, 'IntlBackslash', 192),
    key(256, 'Escape', 27),
    key(257, 'Enter', 13),
    key(258, 'Tab', 20),
    key(259, 'Backspace', 8),
    key(260, 'Insert', 45),
    key(261, 'Delete', 46),
    key(262, 'ArrowRight', 39),
    key(263, 'ArrowLeft', 37),
    key(264, 'ArrowDown', 40),
    key(265, 'ArrowUp', 38),
    key(266, 'PageUp', 33),
    key(267, 'PageDown', 34),
    key(268, 'Home', 36),
    key(269, 'End', 35),
    key(280, 'CapsLock', 20),
    key(281, 'ScrollLock', 145),
    key(282, 'NumLock', 144),
    key(283, 'PrintScreen', 44),
    ...repeat(25, i => key(290 + i, `F${i}`, 112 + i)),
    ...repeat(10, i => key(320 + i, `Numpad${i}`, 96 + i, 3)),
    key(330, 'NumpadDecimal', 110, 3),
    key(331, 'NumpadDivide', 111, 3),
    key(332, 'NumpadMultiply', 106, 3),
    key(333, 'NumpadSubtract', 109, 3),
    key(334, 'NumpadAdd', 107, 3),
    key(335, 'NumpadEnter', 13, 3),
    key(340, 'ShiftLeft', 16, 1),
    key(341, 'ControlLeft', 17, 1),
    key(342, 'AltLeft', 18, 1),
    key(343, 'MetaLeft', 91, 1),
    key(344, 'ShiftRight', 16, 2),
    key(345, 'ControlRight', 17, 2),
    key(346, 'AltRight', 18, 2),
    key(347, 'MetaRight', 93, 2),
    key(348, 'ContextMenu', 93),
]);



function key(id: number, label: string, code = id, location = 0) {
    return [
        id,
        { label, code, location } as KeyMapItem
    ] as const;
}

function repeat(length: number, producer: (i: number) => readonly [number, KeyMapItem]) {
    return Array.from({ length }, (_, i) => producer(i));
}