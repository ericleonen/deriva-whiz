import Function from "../Function";
import { addNecessaryParentheses } from "../generateExpression";
import Constant from "../operands/Constant";
import Integer from "../operands/Integer";
import Transcendental from "../operands/Transcendental";
import Addition from "./Addition";
import Division from "./Division";
import Logarithm from "./Logarithm";
import Multiplication from "./Multiplication";
import Subtraction from "./Subtraction";

export default class Exponentiation extends Function {
    private base: Function;
    private exponent: Function;

    constructor(exponent: Function, base: Function = new Transcendental("e")) {
        super("Exponentiation", base, exponent);

        this.base = base;
        this.exponent = exponent;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (this.base instanceof Transcendental && this.base.symbol === "e") {
            new Multiplication(
                this.exponent.differentiate(),
                this.clone()
            )
        } else if (!this.base.checkHasX()) {
            return new Multiplication(
                new Logarithm(this.base.clone()),
                new Multiplication(
                    this.clone(),
                    this.exponent.differentiate()
                )
            );
        } else if (!this.exponent.checkHasX()) {
            return new Multiplication(
                new Multiplication(
                    this.exponent.clone(),
                    new Exponentiation(
                        new Subtraction(this.exponent.clone(), new Integer(1)),
                        this.base.clone()
                    )
                ),
                this.base.differentiate()
            )
        } 

        return new Multiplication(
            this.clone(),
            new Addition(
                new Multiplication(
                    new Logarithm(this.base!.clone()),
                    this.exponent.differentiate()
                ),
                new Division(
                    new Multiplication(this.exponent.clone(), this.base!.differentiate()),
                    this.base!.clone()
                )
            )
        );
    }

    clone() {
        return new Exponentiation(this.exponent.clone(), this.base ? this.base.clone() : undefined);
    }

    simplify(): Function {
        if (this.base instanceof Integer && this.exponent instanceof Integer) {
            return new Integer(Math.pow(this.base.value, this.exponent.value));
        }

        return new Exponentiation(this.exponent.simplify(), this.base?.simplify());
    }

    evaluate(x: number): number | undefined {
        const base = this.base ? this.base.evaluate(x) : Math.E;
        const exponent = this.exponent.evaluate(x);

        if (base !== undefined && exponent !== undefined) {
            const exp = Math.pow(base, exponent);

            if (!isNaN(exp)) return exp;
        }
    }

    latex(): string {
        return `${addNecessaryParentheses(this.base, true).latex()}^{${this.exponent.latex()}}`;
    }
}