import Function from "../Function";
import { addNecessaryParentheses } from "../generateExpression";
import Integer from "../operands/Integer";
import Negation from "./Negation";

export default class Subtraction extends Function {
    private left: Function;
    private right: Function;

    constructor(left: Function, right: Function) {
        super("Subtraction", left, right);

        this.left = left;
        this.right = right;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (!this.left.checkHasX()) return new Negation(this.right.differentiate());
        else if (!this.right.checkHasX()) return this.left.differentiate();

        return new Subtraction(this.left.differentiate(), this.right.differentiate());
    }

    clone() {
        return new Subtraction(this.left.clone(), this.right.clone());
    }

    simplify(): Function {
        if (this.left instanceof Integer && this.right instanceof Integer) {
            return new Integer(this.left.value - this.right.value);
        }

        return new Subtraction(this.left.simplify(), this.right.simplify());
    }

    evaluate(x: number): number | undefined {
        const left = this.left.evaluate(x);
        const right = this.right.evaluate(x);

        if (left !== undefined && right !== undefined) {
            return left - right;
        }
    }

    latex(): string {
        return `${this.left.latex()}-${addNecessaryParentheses(this.right).latex()}`
    }
}