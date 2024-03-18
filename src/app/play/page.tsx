"use client"

import { EditableMathField, StaticMathField } from "react-mathquill";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import ExpressionGenerator from "@/math/generateExpression";
import Expression from "@/math/Expression";

const NUM_PROBLEMS = 10;

const expressionGenerator = new ExpressionGenerator(NUM_PROBLEMS);
const problems: Expression[] = [];
while (expressionGenerator.hasNext()) {
    problems.push(expressionGenerator.next());
}

export default function Play() {
    const [problem, setProblem] = useState(0);
    const [latex, setLatex] = useState("");

    useEffect(() => {
        if (latex.length === 0) return;

        const expression = new Expression(latex);
        const derivative = problems[problem].differentiate();

        if (derivative && expression.equals(derivative)) {
            setProblem(prevProblem => (prevProblem < NUM_PROBLEMS - 1) ? prevProblem + 1 : prevProblem);
            setLatex("");
        }
    }, [latex, setProblem]);

    return (
        <>
            <TopBar />
            <div className="w-full flex-grow flex flex-col items-center">
                <div className="h-1/4"/>
                <StaticMathField>{`\\frac{d}{dx}\\left(${problems[problem].latex()}\\right)=`}</StaticMathField>
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

// 