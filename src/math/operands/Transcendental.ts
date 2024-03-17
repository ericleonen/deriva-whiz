import Constant from "./Constant";
import Function from "../Function";

export default class Transcendental extends Constant {
    symbol: "e" | "pi";

    constructor(symbol: "e" | "pi") {
        super("Transcendental", symbol === "e" ? Math.E : Math.PI);

        this.symbol = symbol;
    }

    clone(): Function {
        return new Transcendental(this.symbol);
    }

    latex(): string {
        return this.symbol === "e" ? this.symbol : `\\${this.symbol}`;
    }
}