export function gcd(a: number, b: number): number {
    if (a === 0) return b;
    return gcd(b % a, a);
}

export function getDecimalPlaces(n: number): number {
    if (Math.floor(n) === n) return 0;

    return n.toString().split(".")[1].length;
}

export function getRandom(min: number, max: number) {
    if (min >= max) {
        throw new Error("min cannot be greater than or equal to max");
    } 

    const range = max - min;
    return Math.random() * range + min;
}

export function isCharNumeric(c: string) {
    return c === "." || (c.length === 1 && !isNaN(+c));
}

export function isAlpha(str: string) {
    const alphaRegex = /^[a-zA-Z]+$/;
    return alphaRegex.test(str);
}

export function isStart(str: string, i: number, key: string) {
    return i >= 0 && i + key.length <= str.length && str.substring(i, i + key.length) === key;
}

export function startsWith(str: string, key: string) {
    return isStart(str, 0, key);
}

export function isEnd(str: string, i: number, key: string) {
    return i >= 0 && i >= key.length - 1 && str.substring(i - key.length + 1, i + 1) === key;
}

export function endsWith(str: string, key: string) {
    return isEnd(str, str.length - 1, key);
}