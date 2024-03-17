import Function from "../Function";
import Integer from "./Integer";

export default class Variable extends Function {
    constructor() {
        super("Variable");
    }

    differentiate(): Function {
        return new Integer(1);
    }

    checkHasX(): boolean {
        return true;
    }

    clone(): Function {
        return new Variable();
    }

    simplify(): Function {
        return this.clone();
    }

    evaluate(x: number): number | undefined {
        return x;
    }

    latex(): string {
        return "x";
    }
}