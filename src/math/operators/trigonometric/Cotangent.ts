import Function from "../../Function";
import Integer from "../../operands/Integer";
import Exponentiation from "../Exponentiation";
import Negation from "../Negation";
import Cosecant from "./Cosecant";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Cotangent extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Cotangent", angle);

        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Negation(
            new Exponentiation(new Integer(2), new Cosecant(this.angle.clone()))
        );
    }

    clone() {
        return new Cotangent(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(1 / Math.tan(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Cotangent(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return 1 / Math.tan(angle);
        }
    }

    latex(): string {
        return `\\cot\\left(${this.angle.latex()}\\right)`;
    }
}