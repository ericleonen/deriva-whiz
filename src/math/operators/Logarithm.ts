import Function from "../Function";
import Constant from "../operands/Constant";
import Integer from "../operands/Integer";
import Transcendental from "../operands/Transcendental";
import Division from "./Division";
import Multiplication from "./Multiplication";
import Negation from "./Negation";
import Subtraction from "./Subtraction";

export default class Logarithm extends Function {
    private base: Function;
    private power: Function;

    constructor(power: Function, base: Function = new Transcendental("e")) {
        super("Logarithm", base, power);

        this.power = power;
        this.base = base;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);
        else if (
            this.base instanceof Transcendental && this.base.symbol === "e" || 
            !this.base.checkHasX()
        ) {
            return new Division(
                this.power.differentiate(),
                this.power.clone()
            );
        } else if (!this.power.checkHasX()) {
            return new Negation(
                new Division(
                    new Multiplication(this.clone(), this.base.differentiate()),
                    new Multiplication(
                        this.base.clone(),
                        new Logarithm(this.base.clone())
                    )
                )
            );
        }

        return new Division(
            new Subtraction(
                new Division(this.power.differentiate(), this.power.clone()),
                new Division(
                    new Multiplication(this.clone(), this.base.differentiate()),
                    this.base.clone()
                )
            ),
            new Logarithm(this.base.clone())
        );
    }

    clone() {
        return new Logarithm(this.power.clone(), this.base ? this.base.clone() : undefined);
    }

    simplify(): Function {
        if (this.base instanceof Constant && this.power instanceof Constant) {
            const answer = Math.log(this.power.value) / Math.log(this.base.value);

            if (Number.isInteger(answer)) {
                return new Integer(answer);
            }
        }

        return new Logarithm(this.power.simplify(), this.base?.clone());
    }

    evaluate(x: number): number | undefined {
        const base = this.base.evaluate(x);
        const power = this.power.evaluate(x);

        if (base !== undefined && power !== undefined && base > 0 && power > 0) {
            return Math.log(power) / Math.log(base);
        }
    }

    latex(): string {
        const baseLatex = this.base.latex();
        const funcLatex = 
            baseLatex === "e" ? "ln" :
            baseLatex === "10" ? "log" :
            `log_{${baseLatex}}`

        return `\\${funcLatex}\\left(${this.power.latex()}\\right)`;
    }
}