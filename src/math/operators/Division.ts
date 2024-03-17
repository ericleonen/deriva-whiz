import Function from "../Function";
import Constant from "../operands/Constant";
import Integer from "../operands/Integer";
import { gcd } from "../utils";
import Exponentiation from "./Exponentiation";
import Multiplication from "./Multiplication";
import Negation from "./Negation";
import Subtraction from "./Subtraction";

export default class Division extends Function {
    private top: Function;
    private bottom: Function;

    constructor(top: Function, bottom: Function) {
        super("Division", top, bottom);

        this.top = top;
        this.bottom = bottom;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (!this.top.checkHasX()) {
            return new Negation(
                new Division(
                    new Multiplication(this.top.clone(), this.bottom.differentiate()),
                    new Exponentiation(new Integer(2), this.bottom.clone())
                )
            );
        } else if (!this.bottom.checkHasX()) {
            return new Division(
                this.top.differentiate(),
                this.bottom.clone()
            );
        }

        return new Division(
            new Subtraction(
                new Multiplication(this.bottom.clone(), this.top.differentiate()),
                new Multiplication(this.top.clone(), this.bottom.differentiate())
            ),
            new Exponentiation(new Integer(2), this.bottom.clone())
        );
    }

    clone() {
        return new Division(this.top.clone(), this.bottom.clone());
    }

    simplify(): Function {
        if (this.top instanceof Constant && this.bottom instanceof Constant) {
            const quotient = this.top.value / this.bottom.value;

            if (Number.isInteger(quotient)) {
                return new Integer(quotient);
            }

            const gcd_ = gcd(this.top.value, this.bottom.value);
            if (
                gcd_ > 0 && 
                Number.isInteger(this.top.value / gcd_) && Number.isInteger(this.bottom.value / gcd_)
            ) {
                return new Division(
                    new Integer(this.top.value / gcd_),
                    new Integer(this.bottom.value / gcd_)
                );
            }
        }

        return new Division(this.top.simplify(), this.bottom.simplify());
    }

    evaluate(x: number): number | undefined {
        const top = this.top.evaluate(x);
        const bottom = this.bottom.evaluate(x);

        if (top !== undefined && bottom !== undefined && bottom !== 0) {
            return top / bottom;
        }
    }

    latex(): string {
        return `\\frac{${this.top.latex()}}{${this.bottom.latex()}}`;
    }
}