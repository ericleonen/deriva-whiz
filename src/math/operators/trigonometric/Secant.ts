import Function from "../../Function";
import Integer from "../../operands/Integer";
import Multiplication from "../Multiplication";
import Tangent from "./Tangent";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Secant extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Secant", angle);

        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Multiplication(
            this.angle.differentiate(),
            new Multiplication(
                this.clone(),
                new Tangent(this.angle.clone())
            )
        );
    }

    clone() {
        return new Secant(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(1 / Math.cos(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Secant(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return 1 / Math.cos(angle);
        }
    }

    latex(): string {
        return `\\sec\\left(${this.angle.latex()}\\right)`;
    }
}