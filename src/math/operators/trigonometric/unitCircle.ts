import Function from "../../Function";
import Integer from "../../operands/Integer";
import Transcendental from "../../operands/Transcendental";
import Division from "../Division";
import Multiplication from "../Multiplication";
import Negation from "../Negation";
import SquareRoot from "../SquareRoot";

// translate from a function to a angle (a number)
export function mapFunctionToUnitCircleAngle(func: Function): Function | number {
    if (func.checkHasX()) return func.clone();

    const angle = func.evaluate(0); // since func isn't in terms of x, the given x value doesn't matter
    
    if (angle === undefined) return func.clone();
    else if (angle % (Math.PI / 6) === 0 || angle % (Math.PI / 4) === 0) return angle;
    
    return func;
}

// translate from a number to a standard unit circle result from
export function mapNumberToUnitCircleValue(num: number) {
    if (Number.isInteger(num)) {
        return num >= 0 ? new Integer(num) : new Negation(new Integer(-num));
    }

    let func: Function;

    switch (Math.abs(num)) {
        case Math.sqrt(3):
            func = new SquareRoot(new Integer(3));
            break;
        case Math.sqrt(3) / 2:
            func = new Division(new SquareRoot(new Integer(3)), new Integer(2));
            break;
        case Math.sqrt(2) / 2:
            func = new Division(new SquareRoot(new Integer(2)), new Integer(2));
            break;
        case 1 / 2:
            func = new Division(new Integer(1), new Integer(2));
            break;
        default:
            return undefined;
    }

    return num < 0 ? new Negation(func) : func;
}

// translate an angle (a number) to a standard pi-based angle (e.g. pi/4)
export function mapAngleToUnitCircleAngle(angle: number) {
    let func: Function;
    if (angle % Math.PI === 0) {
        const n = angle / Math.PI;
        func = n === 1 ? 
            new Transcendental("pi") : new Multiplication(new Integer(n), new Transcendental("pi"));
    } else if (angle % (Math.PI / 2) === 0) {
        const n = angle / (Math.PI / 2);
        const nPI = n === 1 ? 
            new Transcendental("pi") : new Multiplication(new Integer(n), new Transcendental("pi"));
        
        func = new Division(nPI, new Integer(2));
    } else if (angle % (Math.PI / 3) === 0) {
        const n = angle / (Math.PI / 3);
        const nPI = n === 1 ? 
            new Transcendental("pi") : new Multiplication(new Integer(n), new Transcendental("pi"));
        
        func = new Division(nPI, new Integer(3));
    } else if (angle % (Math.PI / 4) === 0) {
        const n = angle / (Math.PI / 4);
        const nPI = n === 1 ? 
            new Transcendental("pi") : new Multiplication(new Integer(n), new Transcendental("pi"));
        
        func = new Division(nPI, new Integer(4));
    } else if (angle % (Math.PI / 6) === 0) {
        const n = angle / (Math.PI / 6);
        const nPI = n === 1 ? 
            new Transcendental("pi") : new Multiplication(new Integer(n), new Transcendental("pi"));
        
        func = new Division(nPI, new Integer(6));
    } else {
        return undefined;
    }

    return angle < 0 ? new Negation(func) : func;
}