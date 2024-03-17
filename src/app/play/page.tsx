"use client"

import { EditableMathField, StaticMathField } from "react-mathquill";
import TopBar from "./components/TopBar";
import { useEffect, useState } from "react";
import { addNecessaryParentheses, generateExpression } from "@/math/generateExpression";
import Expression from "@/math/Expression";

export default function Play() {
    const [problem, setProblem] = useState(generateExpression());
    const [latex, setLatex] = useState("");

    useEffect(() => {
        const expression = new Expression(latex);

        if (expression && expression.equals(problem.differentiate())) {
            setProblem(generateExpression());
            setLatex("");
        }
    }, [latex]);

    return (
        <>
            <TopBar />
            <div className="w-full flex-grow flex flex-col items-center">
                <div className="h-1/4"/>
                <StaticMathField>{`\\frac{d}{dx}${(addNecessaryParentheses(problem)).latex()}=`}</StaticMathField>
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