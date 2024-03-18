import { getRandom } from "./utils";

export default abstract class Function {
    children: Function[];
    protected name: string;
    private hasX: boolean | undefined;

    constructor(name: string, ...children: (Function | undefined)[]) {
        this.name = name;
        this.hasX = undefined;
        this.children = (children.filter(item => item !== undefined) as unknown) as Function[];
    }

    abstract differentiate(): Function;
    abstract clone(): Function;
    abstract simplify(): Function;
    abstract evaluate(x: number): number | undefined;
    abstract latex(): string; 

    checkHasX(): boolean {
        if (this.hasX === undefined) {
            this.hasX = this.children.some(func => func.checkHasX());
        }

        return this.hasX;
    }

    equals(other: Function, samples: number = 100, min: number = -100, max: number = 100, threshold: number = 0.0001): boolean {
        if (samples <= 0) {
            throw new Error("samples cannot be less than or equal to 0");
        } else if (threshold <= 0) {
            throw new Error("threshold cannot be less than or equal to 0");
        }

        let totalError = 0;

        for (let sample = 1; sample <= samples; sample++) {
            const x = getRandom(min, max);
            const truth = this.evaluate(x);
            const guess = other.evaluate(x);

            if (guess !== undefined && truth !== undefined) totalError += Math.abs(truth - guess);
            if (truth === undefined || totalError < threshold) continue;

            return false;
        }

        return true;
    }
}