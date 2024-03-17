import Function from "../../Function";
import Integer from "../../operands/Integer";
import Multiplication from "../Multiplication";
import Negation from "../Negation";
import Sine from "./Sine";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Cosine extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Cosine", angle);

        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Multiplication(
            new Negation(this.angle.differentiate()),
            new Sine(this.angle.clone())
        );
    }

    clone() {
        return new Cosine(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(Math.cos(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Cosine(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return Math.cos(angle);
        }
    }

    latex(): string {
        return `\\cos\\left(${this.angle.latex()}\\right)`;
    }
}