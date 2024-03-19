import { MAX_PROBLEM_DIFFICULTY, MIN_PROBLEM_DIFFICULTY, TERMINATE_CONSTANT, difficulties } from "@/config";
import Expression from "./Expression";
import Function from "./Function";
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
import { randInt } from "./utils";

export default class ExpressionGenerator {
    private difficultyLeft: number;
    private expressionsLeft: number;
    private weights = Array.from(Array(27)).map(() => 1);

    constructor(numExpressions: number) {
        this.difficultyLeft = numExpressions;
        this.expressionsLeft = numExpressions;
    }

    hasNext(): boolean {
        return this.expressionsLeft > 0;
    }

    next(): [Expression, number] {
        if (!this.hasNext()) throw new Error("cannot call next on an empty generator");

        const difficultyGoal = Math.max(
            Math.min(this.difficultyLeft / this.expressionsLeft, MAX_PROBLEM_DIFFICULTY),
            MIN_PROBLEM_DIFFICULTY
        );
        const [difficultyDelta, expression] = this.buildExpression(difficultyGoal, new Variable(), false);

        const expressionDifficulty = difficultyGoal - difficultyDelta;
        this.difficultyLeft -= expressionDifficulty;

        this.expressionsLeft--;

        return [new Expression(expression), expressionDifficulty];
    }

    private terminateProb(difficulty: number) {
        return 1 / (1 + Math.exp(TERMINATE_CONSTANT * (difficulty - MIN_PROBLEM_DIFFICULTY / 2)));
    }

    private buildExpression(difficulty: number, expression: Function = new Variable(), canTerminate: boolean = true): [number, Function] {
        if (canTerminate && Math.random() < this.terminateProb(difficulty)) {
            return [difficulty, expression];
        }

        const choice = this.choose();
        let otherExpression: Function;

        switch(choice) {
            case 0: // x + c
                expression = new Addition(expression, new Integer(randInt(1, 9)));
                break;
            case 1: // c + x
                expression = new Addition(new Integer(randInt(1, 9)), expression);
                break;
            case 2: // x - c
                expression = new Subtraction(expression, new Integer(randInt(1, 9)));
                break;
            case 3: // c - x
                expression = new Subtraction(new Integer(randInt(1, 9)), expression);
                break;
            case 4: // x + x
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Addition(expression, otherExpression);
                break;
            case 5: // x - x
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Subtraction(expression, otherExpression);
                break;
            case 6: // c * x
                expression = new Multiplication(new Integer(randInt(2, 9)), expression);
                break;
            case 7: // x / c
                expression = new Division(expression, new Integer(randInt(2, 9)));
                break;
            case 8: // -x
                expression = new Negation(expression);
                break;
            case 9: // x * x
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Multiplication(expression, otherExpression);
                break;
            case 10: // c / x
                expression = new Division(new Integer(randInt(2, 9)), expression);
                break;
            case 11: // x^c
                expression = new Exponentiation(new Integer(randInt(2, 9)), expression);
                break;
            case 12: // e^x
                expression = new Exponentiation(expression);
                break;
            case 13: // sqrt(x)
                expression = new SquareRoot(expression);
                break;
            case 14: // ln(x)
                expression = new Logarithm(expression);
                break;
            case 15: // sin(x)
                expression = new Sine(expression);
                break;
            case 16: // cos(x)
                expression = new Cosine(expression);
                break;
            case 17: // tan(x)
                expression = new Tangent(expression);
                break;
            case 18: // x / x
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Division(expression, otherExpression);
                break;
            case 19: // c^x
                expression = new Exponentiation(expression, new Integer(randInt(2, 9)));
                break;
            case 20: // log_c(x)
                expression = new Logarithm(expression, new Integer(randInt(2, 10)));
                break;
            case 21: // csc(x)
                expression = new Cosecant(expression);
                break;
            case 22: // sec(x)
                expression = new Secant(expression);
                break;
            case 23: // cot(x)
                expression = new Cotangent(expression);
                break;
            case 24: // x^x
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Exponentiation(expression, otherExpression);
                break;
            case 25: // log_x(c)
                expression = new Logarithm(new Integer(randInt(2, 9)), expression);
                break;
            case 26: // log_x(x)
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Logarithm(expression, otherExpression);
                break;
            default:
                throw new Error();
        }


        this.weights[choice] *= (100 - difficulties[choice]) / 100;
        return this.buildExpression(difficulty - difficulties[choice] / 100, expression);
    }

    private choose() {
        const weightsSum = this.weights.reduce((prev, curr) => prev + curr);
        const rand = Math.random() * weightsSum;
        let sum = 0;
    
        for (let index = 0; index < this.weights.length; index++) {
            sum += this.weights[index];
    
            if (rand <= sum) return index;
        }
    
        return -1; // all else fails, end the expression
    }
}