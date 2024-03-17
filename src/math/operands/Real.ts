import Function from "../Function";
import Division from "../operators/Division";
import { getDecimalPlaces } from "../utils";
import Constant from "./Constant";
import Integer from "./Integer";

export default class Real extends Constant {
    constructor(value: number) {
        super("Real", value);
    }

    clone(): Function {
        return new Real(this.value);
    }

    simplify(): Function {
        if (Number.isInteger(this.value)) {
            return new Integer(this.value);
        } else {
            const t = Math.pow(10, getDecimalPlaces(this.value));
            const frac = new Division(new Integer(this.value * t), new Integer(t));

            return frac.simplify();
        }
    }
}