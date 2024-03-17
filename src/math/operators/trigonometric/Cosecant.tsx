import Function from "../../Function";
import Integer from "../../operands/Integer";
import Multiplication from "../Multiplication";
import Negation from "../Negation";
import Cotangent from "./Cotangent";
import { mapFunctionToUnitCircleAngle, mapNumberToUnitCircleValue } from "./unitCircle";

export default class Cosecant extends Function {
    angle: Function;

    constructor(angle: Function) {
        super("Cosecant", angle);
        
        this.angle = angle;
    }

    differentiate(): Function {
        if (!this.checkHasX()) return new Integer(0);

        return new Negation(
            new Multiplication(
                this.angle.differentiate(),
                new Multiplication(
                    this.clone(),
                    new Cotangent(this.angle.clone())
                )
            )
        );
    }

    clone() {
        return new Cosecant(this.angle.clone());
    }

    simplify(): Function {
        const stdAngle = mapFunctionToUnitCircleAngle(this.angle);

        if (typeof stdAngle === "number") {
            const stdResult = mapNumberToUnitCircleValue(1 / Math.sin(stdAngle));

            if (stdResult instanceof Function) return stdResult;
        }

        return new Cosecant(this.angle.simplify());
    }

    evaluate(x: number): number | undefined {
        const angle = this.angle.evaluate(x);

        if (angle !== undefined) {
            return 1 / Math.sin(angle);
        }
    }

    latex(): string {
        return `\\csc\\left(${this.angle.latex()}\\right)`;
    }
}