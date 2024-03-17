import Function from "../Function";
import Constant from "../operands/Constant";
import Integer from "../operands/Integer";
import Division from "./Division";
import Exponentiation from "./Exponentiation";
import Logarithm from "./Logarithm";
import Multiplication from "./Multiplication";
import Negation from "./Negation";
import Subtraction from "./Subtraction";

export default class SquareRoot extends Function {
    private inner: Function;

    constructor(inner: Function) {
        super("Root", inner);

        this.inner = inner;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Division(
            this.inner.differentiate(),
            new Multiplication(new Integer(2), this.clone())
        )
    }

    clone(): Function {
        return new SquareRoot(this.inner);
    }

    simplify(): Function {
        if (this.inner instanceof Integer) {
            const sqrt = Math.sqrt(this.inner.value);

            if (Number.isInteger(sqrt)) return new Integer(sqrt);
        }

        return this.clone();
    }

    evaluate(x: number): number | undefined {
        const inner = this.inner.evaluate(x);

        if (inner !== undefined && inner >= 0) return Math.sqrt(inner);
    }

    latex(): string {
        return `\\sqrt{${this.inner.latex()}}`;
    }
}