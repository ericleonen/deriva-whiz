import { StaticMathField, EditableMathField } from "react-mathquill";
import TopBar from "./TopBar";
import { useEffect, useMemo, useState } from "react";
import Expression from "@/math/Expression";
import ExpressionGenerator from "@/math/generateExpression";
import { useAtom, useSetAtom } from "jotai";
import { gameActiveAtom, problemAtom, timeAtom } from "../page";
import { NUM_PROBLEMS } from "@/config";

const makeProblems = () => {
    const expressionGenerator = new ExpressionGenerator(NUM_PROBLEMS);
    const problems: Expression[] = [];
    while (expressionGenerator.hasNext()) {
        problems.push(expressionGenerator.next());
    }

    return problems;
}

export default function Game() {
    const [latex, setLatex] = useState("");
    const [problem, setProblem] = useAtom(problemAtom);
    const setTime = useSetAtom(timeAtom);
    const setGameActive = useSetAtom(gameActiveAtom);
    const problems = useMemo(makeProblems, []);

    useEffect(() => {
        if (latex.length === 0) return;

        const expression = new Expression(latex);
        const derivative = problems[problem].differentiate();

        console.log(derivative);

        if (derivative && expression.equals(derivative)) {
            setProblem(prevProblem => prevProblem + 1);
            setLatex("");
        }
    }, [latex, setProblem]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => prev + 1);
        }, 10);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (problem >= NUM_PROBLEMS) setGameActive(false);
    }, [problem])

    return (
        <>   
            <TopBar />
            <div className="w-full flex-grow flex flex-col items-center">
                <div className="h-1/4"/>
                <StaticMathField>{`\\frac{d}{dx}\\left(${problems[Math.min(NUM_PROBLEMS - 1, problem)].latex()}\\right)=`}</StaticMathField>
                <div className="h-4"/>
                <EditableMathField 
                    latex={latex}
                    onChange={mathField => setLatex(mathField.latex())}
                    mathquillDidMount={mathField => mathField.focus()}
                    config={{
                        autoCommands: "sqrt"
                    }}
                    className="p-2 min-w-[300px] rounded-sm text-center"
                />
            </div>
        </>
    )
}