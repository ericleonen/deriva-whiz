import Function from "../Function";
import Integer from "./Integer";

export default abstract class Constant extends Function {
    value: number;

    constructor(name: string, value: number) {
        super(name);

        if (!isFinite(value)) {
            throw new Error("constants must be finite");
        }

        this.value = value;
    }

    differentiate(): Function {
        return new Integer(0);
    }

    checkHasX(): boolean {
        return false;
    }

    simplify(): Function {
        return this.clone();
    }

    evaluate(x: number): number | undefined {
        return this.value;
    }

    latex(): string {
        return `${this.value}`;
    }
}