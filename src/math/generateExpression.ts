import Function from "./Function";
import Parentheses from "./Parentheses";
import Integer from "./operands/Integer";
import Variable from "./operands/Variable";
import Addition from "./operators/Addition";
import Division from "./operators/Division";
import Exponentiation from "./operators/Exponentiation";
import Logarithm from "./operators/Logarithm";
import Multiplication from "./operators/Multiplication";
import Negation from "./operators/Negation";
import SquareRoot from "./operators/SquareRoot";
import Subtraction from "./operators/Subtraction";
import Cosecant from "./operators/trigonometric/Cosecant";
import Cosine from "./operators/trigonometric/Cosine";
import Cotangent from "./operators/trigonometric/Cotangent";
import Secant from "./operators/trigonometric/Secant";
import Sine from "./operators/trigonometric/Sine";
import Tangent from "./operators/trigonometric/Tangent";

function nextChoice(weights: number[]) {
    const weightsSum = weights.reduce((prev, curr) => prev + curr);
    const rand = Math.random() * weightsSum;
    let sum = 0;

    for (let index = 0; index < weights.length; index++) {
        sum += weights[index];

        if (rand <= sum) return index;
    }

    return 0; // all else fails, end the expression
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (1 + max - min) + min);
}

export function addNecessaryParentheses(expression: Function, functions: boolean = false) {
    if (
        expression instanceof Subtraction || 
        expression instanceof Addition ||
        expression instanceof Negation ||
        functions && (
            expression instanceof Division ||
            expression instanceof Sine ||
            expression instanceof Cosine ||
            expression instanceof Tangent ||
            expression instanceof Cosecant ||
            expression instanceof Secant ||
            expression instanceof Cotangent ||
            expression instanceof Logarithm ||
            expression instanceof Exponentiation ||
            expression instanceof SquareRoot
        )
    ) {
        return new Parentheses(expression);
    }

    return expression;
}

export function generateExpression(expression: Function = new Variable()) {
    let temp = Array.from(Array(27)).map(() => 1);
    temp = [temp.length].concat(temp);

    const choice = nextChoice(temp);
    let nextExpression: Function;

    switch (choice) {
        case 0: // TERMINATE EXPRESSION
            return expression;
        case 1: // x + c
            nextExpression = new Addition(expression, new Integer(randInt(1, 9)));
            break;
        case 2: // c + x
            nextExpression = new Addition(new Integer(randInt(1, 9)), expression);
            break;
        case 3: // x - c
            nextExpression = new Subtraction(expression, new Integer(randInt(1, 9)));
            break;
        case 4: // c - x
            nextExpression = new Subtraction(new Integer(randInt(1, 9)), expression);
            break;
        case 5: // x + x
            nextExpression = new Addition(expression, generateExpression());
            break;
        case 6: // x - x
            nextExpression = new Subtraction(expression, generateExpression());
            break;
        case 7: // c * x
            nextExpression = new Multiplication(new Integer(randInt(2, 9)), expression);
            break;
        case 8: // x / c
            nextExpression = new Division(expression, new Integer(randInt(2, 9)));
            break;
        case 9: // -x
            nextExpression = new Negation(expression);
            break;
        case 10: // x * x
            nextExpression = new Multiplication(expression, generateExpression());
            break;
        case 11: // c / x
            nextExpression = new Division(new Integer(randInt(2, 9)), expression);
            break;
        case 12: // x^c
            nextExpression = new Exponentiation(new Integer(randInt(2, 9)), expression);
            break;
        case 13: // e^x
            nextExpression = new Exponentiation(expression);
            break;
        case 14: // sqrt(x)
            nextExpression = new SquareRoot(expression);
            break;
        case 15: // ln(x)
            nextExpression = new Logarithm(expression);
            break;
        case 16: // sin(x)
            nextExpression = new Sine(expression);
            break;
        case 17: // cos(x)
            nextExpression = new Cosine(expression);
            break;
        case 18: // tan(x)
            nextExpression = new Tangent(expression);
            break;
        case 19: // x / x
            nextExpression = new Division(expression, generateExpression());
            break;
        case 20: // c^x
            nextExpression = new Exponentiation(expression, new Integer(randInt(2, 9)));
            break;
        case 21: // log_c(x)
            nextExpression = new Logarithm(expression, new Integer(randInt(2, 10)));
            break;
        case 22: // csc(x)
            nextExpression = new Cosecant(expression);
            break;
        case 23: // sec(x)
            nextExpression = new Secant(expression);
            break;
        case 24: // cot(x)
            nextExpression = new Cotangent(expression);
            break;
        case 25: // x^x
            nextExpression = new Exponentiation(expression, generateExpression());
            break;
        case 26: // log_x(c)
            nextExpression = new Logarithm(new Integer(randInt(2, 9)), expression);
            break;
        case 27: // log_x(x)
            nextExpression = new Logarithm(expression, generateExpression());
            break;
        default: // case N
            return expression;
    }

    return generateExpression(nextExpression);
}