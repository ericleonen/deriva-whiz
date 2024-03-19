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

    next(): Expression {
        if (!this.hasNext()) throw new Error("cannot call next on an empty generator");

        const difficultyGoal = this.difficultyLeft / this.expressionsLeft;
        const [difficultyDelta, expression] = this.buildExpression(difficultyGoal);

        const expressionDifficulty = difficultyGoal - difficultyDelta;
        this.difficultyLeft -= expressionDifficulty;

        this.expressionsLeft--;

        return new Expression(expression);
    }

    private terminateProb(difficulty: number) {
        return 1 / (1 + Math.exp(5 * difficulty));
    }

    private buildExpression(difficulty: number, expression: Function = new Variable()): [number, Function] {
        if (Math.random() < this.terminateProb(difficulty)) {
            return [difficulty, expression];
        }

        const choice = this.choose();
        let otherExpression: Function;
        let addedDifficulty = 0; // 0 being no added difficulty, 100 being impossible

        switch(choice) {
            case 0: // x + c
                addedDifficulty = 10;
                expression = new Addition(expression, new Integer(randInt(1, 9)));
                break;
            case 1: // c + x
                addedDifficulty = 10;
                expression = new Addition(new Integer(randInt(1, 9)), expression);
                break;
            case 2: // x - c
                addedDifficulty = 15;
                expression = new Subtraction(expression, new Integer(randInt(1, 9)));
                break;
            case 3: // c - x
                addedDifficulty = 15;
                expression = new Subtraction(new Integer(randInt(1, 9)), expression);
                break;
            case 4: // x + x
                addedDifficulty = 15;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Addition(expression, otherExpression);
                break;
            case 5: // x - x
                addedDifficulty = 20;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Subtraction(expression, otherExpression);
                break;
            case 6: // c * x
                addedDifficulty = 20;
                expression = new Multiplication(new Integer(randInt(2, 9)), expression);
                break;
            case 7: // x / c
                addedDifficulty = 20;
                expression = new Division(expression, new Integer(randInt(2, 9)));
                break;
            case 8: // -x
                addedDifficulty = 20;
                expression = new Negation(expression);
                break;
            case 9: // x * x
                addedDifficulty = 40;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Multiplication(expression, otherExpression);
                break;
            case 10: // c / x
                addedDifficulty = 40;
                expression = new Division(new Integer(randInt(2, 9)), expression);
                break;
            case 11: // x^c
                addedDifficulty = 45
                expression = new Exponentiation(new Integer(randInt(2, 9)), expression);
                break;
            case 12: // e^x
                addedDifficulty = 35;
                expression = new Exponentiation(expression);
                break;
            case 13: // sqrt(x)
                addedDifficulty = 50;
                expression = new SquareRoot(expression);
                break;
            case 14: // ln(x)
                addedDifficulty = 50;
                expression = new Logarithm(expression);
                break;
            case 15: // sin(x)
                addedDifficulty = 50;
                expression = new Sine(expression);
                break;
            case 16: // cos(x)
                addedDifficulty = 50;
                expression = new Cosine(expression);
                break;
            case 17: // tan(x)
                addedDifficulty = 60;
                expression = new Tangent(expression);
                break;
            case 18: // x / x
                addedDifficulty = 87;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Division(expression, otherExpression);
                break;
            case 19: // c^x
                addedDifficulty = 80;
                expression = new Exponentiation(expression, new Integer(randInt(2, 9)));
                break;
            case 20: // log_c(x)
                addedDifficulty = 70;
                expression = new Logarithm(expression, new Integer(randInt(2, 10)));
                break;
            case 21: // csc(x)
                addedDifficulty = 65;
                expression = new Cosecant(expression);
                break;
            case 22: // sec(x)
                addedDifficulty = 60;
                expression = new Secant(expression);
                break;
            case 23: // cot(x)
                addedDifficulty = 65;
                expression = new Cotangent(expression);
                break;
            case 24: // x^x
                addedDifficulty = 95;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Exponentiation(expression, otherExpression);
                break;
            case 25: // log_x(c)
                addedDifficulty = 90;
                expression = new Logarithm(new Integer(randInt(2, 9)), expression);
                break;
            case 26: // log_x(x)
                addedDifficulty = 95;
                [difficulty, otherExpression] = this.buildExpression(difficulty);
                expression = new Logarithm(expression, otherExpression);
                break;
        }

        this.weights[choice] *= (100 - addedDifficulty) / 100;

        return this.buildExpression(difficulty - addedDifficulty / 100, expression);
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