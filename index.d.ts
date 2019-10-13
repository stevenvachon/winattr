export function get(path: string, callback: (err: Error, attrs: object) => any): void;
export function getSync(path: string): any;

export function set(path: string, attrs: object, callback: (err: Error, attrs: object) => any): void;
export function setSync(path: string, attrs: object): void;
