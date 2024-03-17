import Function from "../Function";
import Constant from "./Constant";

export default class Integer extends Constant {
    constructor(value: number) {
        super("Integer", value);

        if (!Number.isInteger(value)) {
            throw new Error("value is not an integer");
        }
    }

    clone(): Function {
        return new Integer(this.value);
    }
}