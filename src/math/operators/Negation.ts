import Function from "../Function";
import { addNecessaryParentheses } from "../generateExpression";
import Integer from "../operands/Integer";

export default class Negation extends Function {
    private inner: Function;

    constructor(inner: Function) {
        super("Negation", inner);

        this.inner = inner;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        
        return new Negation(this.inner.differentiate());
    }

    clone() {
        return new Negation(this.inner.clone());
    }

    simplify(): Function {
        return new Negation(this.inner.simplify());
    }

    evaluate(x: number): number | undefined {
        const inner = this.inner.evaluate(x);

        if (inner !== undefined) {
            return -inner;
        }
    }

    latex(): string {
        return `-${addNecessaryParentheses(this.inner).latex()}`;
    }
}