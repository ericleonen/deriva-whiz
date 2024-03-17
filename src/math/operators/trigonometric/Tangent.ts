import Function from "../../Function";
import Integer from "../../operands/Integer";
import Exponentiation from "../Exponentiation";
import Multiplication from "../Multiplication";
import Secant from "./Secant";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Tangent extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Tangent", angle);

        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Multiplication(
            this.angle.differentiate(),
            new Exponentiation(new Integer(2), new Secant(this.angle.clone()))
        );
    }

    clone() {
        return new Tangent(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(Math.tan(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Tangent(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return Math.tan(angle);
        }
    }

    latex(): string {
        return `\\tan\\left(${this.angle.latex()}\\right)`;
    }
}