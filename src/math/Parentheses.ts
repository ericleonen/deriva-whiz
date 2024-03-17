import Function from "./Function";
import Integer from "./operands/Integer";

export default class Parentheses extends Function {
    inner: Function;

    constructor(inner: Function) {
        super("Parentheses", inner);

        this.inner = inner;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        
        return new Parentheses(this.inner.differentiate());
    }

    clone() {
        return new Parentheses(this.inner.clone());
    }

    simplify(): Function {
        return new Parentheses(this.inner.simplify());
    }

    evaluate(x: number): number | undefined {
        return this.inner.evaluate(x);
    }

    latex(): string {
        return `\\left(${this.inner.latex()}\\right)`;
    }
}