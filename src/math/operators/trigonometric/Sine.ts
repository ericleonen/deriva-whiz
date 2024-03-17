import Function from "../../Function";
import Integer from "../../operands/Integer";
import Multiplication from "../Multiplication";
import Cosine from "./Cosine";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Sine extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Sine", angle);

        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Multiplication(
            this.angle.differentiate(),
            new Cosine(this.angle.clone())
        );
    }

    clone() {
        return new Sine(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(Math.sin(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Sine(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return Math.sin(angle);
        }
    }

    latex(): string {
        return `\\sin\\left(${this.angle.latex()}\\right)`;
    }
}