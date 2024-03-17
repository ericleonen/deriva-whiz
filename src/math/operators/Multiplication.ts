import Function from "../Function";
import Integer from "../operands/Integer";
import Real from "../operands/Real";
import Addition from "./Addition";
import Constant from "../operands/Constant";
import { addNecessaryParentheses } from "../generateExpression";

export default class Multiplication extends Function {
    private left: Function;
    private right: Function;
    private isImplicit: boolean;

    constructor(left: Function, right: Function, isImplicit: boolean = true) {
        super("Multiplication", left, right);

        this.left = left;
        this.right = right;
        this.isImplicit = isImplicit;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (!this.left.checkHasX()) {
            return new Multiplication(this.left.clone(), this.right.differentiate());
        }
        else if (!this.right.checkHasX()) {
            return new Multiplication(this.right.clone(), this.left.differentiate());
        }

        return new Addition(
            new Multiplication(this.left.clone(), this.right.differentiate()),
            new Multiplication(this.right.clone(), this.left.differentiate())
        );
    }

    clone(): Function {
        return new Multiplication(this.left.clone(), this.right.clone());
    }

    simplify(): Function {
        if (this.left instanceof Constant && this.right instanceof Constant) {
            const product = this.left.value * this.right.value;

            if (Number.isInteger(product)) {
                return new Integer(product);
            }
        } else if (this.left instanceof Integer && this.left.value === 1) {
            return this.right.clone();
        } else if (this.right instanceof Integer && this.right.value === 1) {
            return this.left.clone();
        }

        return new Multiplication(this.left.simplify(), this.right.simplify());
    }

    evaluate(x: number): number | undefined {
        const left = this.left.evaluate(x);
        const right = this.right.evaluate(x);

        if (left !== undefined && right !== undefined) {
            return left * right;
        }
    }

    latex(): string {
        const isImplicit = this.isImplicit && 
            !(
                (this.left instanceof Real || this.left instanceof Integer) && 
                (this.right instanceof Real || this.right instanceof Integer)
            )

        return `${addNecessaryParentheses(this.left).latex()}${isImplicit ? "" : "\\cdot"}${addNecessaryParentheses(this.right).latex()}`;
    }
}