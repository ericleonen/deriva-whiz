import Function from "./Function";
import { isCharNumeric, isEnd, isStart, startsWith } from "./utils";
import Addition from "./operators/Addition";
import Subtraction from "./operators/Subtraction";
import Integer from "./operands/Integer";
import Sine from "./operators/trigonometric/Sine";
import Exponentiation from "./operators/Exponentiation";
import Division from "./operators/Division";
import Logarithm from "./operators/Logarithm";
import Cosine from "./operators/trigonometric/Cosine";
import Tangent from "./operators/trigonometric/Tangent";
import Cosecant from "./operators/trigonometric/Cosecant";
import Secant from "./operators/trigonometric/Secant";
import Cotangent from "./operators/trigonometric/Cotangent";
import Multiplication from "./operators/Multiplication";
import Real from "./operands/Real";
import Transcendental from "./operands/Transcendental";
import Variable from "./operands/Variable";
import SquareRoot from "./operators/SquareRoot";

const NUM_SYMBOLS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
const OPERATOR_SYMBOLS = ["+", "-", "^", "\\cdot"];
const OPERAND_SYMBOLS = ["\\pi", "e", "x"];
const OPEN_SYMBOLS = ["\\left(", "{"];
const CLOSE_SYMBOLS = ["\\right)", "}"];
const ONE_ARG_FUNCS = [
    "\\sin", "\\cos", "\\tan", "\\csc", "\\sec", "\\cot",
    "\\log", "\\ln", "\\sqrt"
];
const TWO_ARG_FUNCS = [
    "\\sin^", "\\cos^", "\\tan^", "\\csc^", "\\sec^", "\\cot^",
    "\\log_", "\\log^", "\\ln^",
    "\\frac"
];

export default class Expression {
    private root?: Function;

    constructor(expression?: Function | string) {
        try {
            this.root = 
                expression instanceof Function ? expression :
                typeof expression === "string" ? this.buildTree(expression.replaceAll(" ", "")) :
                expression;

            console.log(this.root);
        } catch (err) {
            console.log(err);
        }
    }

    private splitSymbols(expression: string): string[] {
        if (expression === "") return [];

        // PARENTHESES & BRACKETS
        let openCount = 0;
        let openIndex = -1;

        expressionLoop: for (let index = 0; index < expression.length; index++) {
            for (const symbol of OPEN_SYMBOLS) {
                if (isStart(expression, index, symbol)) {
                    openCount++;
                    if (openIndex < 0) {
                        openIndex = index;
                    }

                    index += symbol.length - 1;

                    continue expressionLoop;
                };
            }

            for (const symbol of CLOSE_SYMBOLS) {
                if (isEnd(expression, index, symbol)) {
                    openCount--;
                    
                    if (openCount === 0) {
                        const leftGroup = expression.substring(0, openIndex);
                        const group = expression.substring(openIndex, index + 1);
                        const rightGroup = expression.substring(index + 1);

                        return [...this.splitSymbols(leftGroup), group, ...this.splitSymbols(rightGroup)];
                    }
                };
            }
        }

        // OTHER SYMBOLS
        for (const symbol of [
            ...TWO_ARG_FUNCS,
            ...ONE_ARG_FUNCS,
            ...OPERAND_SYMBOLS,
            ...OPERATOR_SYMBOLS,
            ...NUM_SYMBOLS
        ]) {
            if (startsWith(expression, symbol)) {
                return [symbol, ...this.splitSymbols(expression.substring(symbol.length))];
            }
        }

        throw new Error(`Invalid symbol: ${expression}`);
    }

    private joinTerm(functions: Function[]) {
        let root = undefined;

        for (let functionTree of functions) {
            if (!root) root = functionTree;
            else root = new Multiplication(root, functionTree);
        }

        return root;
    }

    private nextTerm(symbols: string[], full: boolean = true): string {
        if (symbols.length === 0) throw new Error();

        let symbol: string = symbols.shift()!;

        if (!full) return symbol;
        else if (isCharNumeric(symbol)) {
            while (symbols.length > 0 && isCharNumeric(symbols[0])) {
                symbol += symbols.shift();
            }  
        }

        return symbol;
    }

    private buildTree(expression: string | string[]): Function | undefined {
        const symbols = typeof expression === "string" ? this.splitSymbols(expression) : expression;
        const functions: Function[] = [];

        while (symbols.length > 0) {
            const symbol = this.nextTerm(symbols);
            let functionTree: Function;

            if (!isNaN(+symbol)) {
                if (symbol.includes(".")) functionTree = new Real(+symbol);
                else functionTree = new Integer(+symbol);
            } else if ("+-".includes(symbol)) {
                const leftTree = functions.length === 0 ? new Integer(0) : this.joinTerm(functions);
                const rightTree = this.buildTree(symbols);

                if (!rightTree) throw new Error();
                else if (symbol === "+") {
                    return new Addition(leftTree!, rightTree);
                } else { // symbol === "-"
                    return new Subtraction(leftTree!, rightTree);
                }
            } else if (symbol === "^") {
                if (functions.length === 0) throw new Error();
                const exponent = this.buildTree(this.nextTerm(symbols, false));

                if (!exponent) throw new Error();
                
                functionTree = new Exponentiation(
                    exponent,
                    functions.pop()
                );
            } else if (symbol === "\\cdot") {
                continue;
            } else if (symbol === "\\pi") {
                functionTree = new Transcendental("pi");
            } else if (symbol === "e") {
                functionTree = new Transcendental("e");
            } else if (symbol === "x") {
                functionTree = new Variable();
            } else if (ONE_ARG_FUNCS.includes(symbol)) {
                const argTree = this.buildTree(this.nextTerm(symbols));

                if (!argTree) throw new Error();

                if (symbol === "\\sin") {
                    functionTree = new Sine(argTree);
                } else if (symbol === "\\cos") {
                    functionTree = new Cosine(argTree);
                } else if (symbol === "\\tan") {
                    functionTree = new Tangent(argTree);
                } else if (symbol === "\\csc") {
                    functionTree = new Cosecant(argTree);
                } else if (symbol === "\\sec") {
                    functionTree = new Secant(argTree);
                } else if (symbol === "\\cot") {
                    functionTree = new Cotangent(argTree);
                } else if (symbol === "\\log") {
                    functionTree = new Logarithm(argTree, new Integer(10));
                } else if (symbol === "\\ln") {
                    functionTree = new Logarithm(argTree);
                } else { // symbol === "\\sqrt"
                    functionTree = new SquareRoot(argTree);
                }
            } else if (TWO_ARG_FUNCS.includes(symbol)) {
                const arg1Tree = this.buildTree(this.nextTerm(symbols, false));
                const arg2Tree = this.buildTree(this.nextTerm(symbols, true));

                if (!arg1Tree || !arg2Tree) throw new Error();

                if (symbol === "\\sin^") {
                    functionTree = new Exponentiation(arg1Tree, new Sine(arg2Tree));
                } else if (symbol === "\\cos^") {
                    functionTree = new Exponentiation(arg1Tree, new Cosine(arg2Tree));
                } else if (symbol === "\\tan^") {
                    functionTree = new Exponentiation(arg1Tree, new Tangent(arg2Tree));
                } else if (symbol === "\\csc^") {
                    functionTree = new Exponentiation(arg1Tree, new Cosecant(arg2Tree));
                } else if (symbol === "\\sec^") {
                    functionTree = new Exponentiation(arg1Tree, new Secant(arg2Tree));
                } else if (symbol === "\\cot^") {
                    functionTree = new Exponentiation(arg1Tree, new Cotangent(arg2Tree));
                } else if (symbol === "\\log^") {
                    functionTree = new Exponentiation(arg1Tree, new Logarithm(arg2Tree, new Integer(10)));
                } else if (symbol === "\\ln^") {
                    functionTree = new Exponentiation(arg1Tree, new Logarithm(arg2Tree));
                } else if (symbol === "\\frac") {
                    functionTree = new Division(arg1Tree, arg2Tree);
                } else { // symbol === "\\log_"
                    functionTree = new Logarithm(arg2Tree, arg1Tree);
                }
            } else if (OPEN_SYMBOLS.some(s => startsWith(symbol, s))) {
                for (let index = 0; index < OPEN_SYMBOLS.length; index++) {
                    const openSymbol = OPEN_SYMBOLS[index];
                    const closeSymbol = CLOSE_SYMBOLS[index];

                    if (!symbol.startsWith(openSymbol) || !symbol.endsWith(closeSymbol)) continue;

                    const tree = this.buildTree(symbol.substring(openSymbol.length, symbol.length - closeSymbol.length));

                    if (!tree) throw new Error();

                    functionTree = tree;
                }
            } else {
                throw new Error();
            }

            functions.push(functionTree!);
        }

        return this.joinTerm(functions);
    }

    equals(expression: Expression | Function): boolean {
        return this.root ? expression.equals(this.root) : false;
    }

    latex(): string | undefined {
        return this.root && this.root.latex();
    }

    differentiate(): Function | undefined {
        return this.root!.differentiate();
    }
}