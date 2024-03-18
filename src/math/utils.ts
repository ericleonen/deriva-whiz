import Parentheses from "./Parentheses";
import Addition from "./operators/Addition";
import Division from "./operators/Division";
import Exponentiation from "./operators/Exponentiation";
import Logarithm from "./operators/Logarithm";
import Negation from "./operators/Negation";
import SquareRoot from "./operators/SquareRoot";
import Subtraction from "./operators/Subtraction";
import Cosecant from "./operators/trigonometric/Cosecant";
import Cosine from "./operators/trigonometric/Cosine";
import Cotangent from "./operators/trigonometric/Cotangent";
import Secant from "./operators/trigonometric/Secant";
import Sine from "./operators/trigonometric/Sine";
import Tangent from "./operators/trigonometric/Tangent";
import Function from "./Function";

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

export function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (1 + max - min) + min);
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

export function addNecessaryParentheses(expression: Function, functions: boolean = false) {
    if (
        expression instanceof Subtraction || 
        expression instanceof Addition ||
        expression instanceof Negation ||
        functions && (
            expression instanceof Division ||
            expression instanceof Sine ||
            expression instanceof Cosine ||
            expression instanceof Tangent ||
            expression instanceof Cosecant ||
            expression instanceof Secant ||
            expression instanceof Cotangent ||
            expression instanceof Logarithm ||
            expression instanceof Exponentiation ||
            expression instanceof SquareRoot
        )
    ) {
        return new Parentheses(expression);
    }

    return expression;
}

export const formatTime = (cs: number) => {
    const s = cs / 100;

    switch (getDecimalPlaces(s)) {
        case 0:
            return s + ".00";
        case 1:
            return s + "0";
        default:
            return s;
    }
}