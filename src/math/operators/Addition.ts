import Function from "../Function";
import Integer from "../operands/Integer";

export default class Addition extends Function {
    left: Function;
    right: Function;

    constructor(left: Function, right: Function) {
        super("Addition", left, right);

        this.left = left;
        this.right = right;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (!this.left.checkHasX()) return this.right.differentiate();
        else if (!this.right.checkHasX()) return this.left.differentiate();

        return new Addition(this.left.differentiate(), this.right.differentiate());
    }

    clone() {
        return new Addition(this.left.clone(), this.right.clone());
    }

    simplify(): Function {
        if (this.left instanceof Integer && this.right instanceof Integer) {
            return new Integer(this.left.value + this.right.value);
        }

        return new Addition(this.left.simplify(), this.right.simplify());
    }

    evaluate(x: number): number | undefined {
        const left = this.left.evaluate(x);
        const right = this.right.evaluate(x);

        if (left !== undefined && right !== undefined) {
            return left + right;
        }
    }

    latex(): string {
        return `${this.left.latex()}+${this.right.latex()}`;
    }
}