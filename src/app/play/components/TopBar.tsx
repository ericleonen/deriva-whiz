import { Trigger } from "@/types"
import { ReactNode } from "react"
import { problemAtom, timeAtom } from "../page"
import { useAtom, useSetAtom } from "jotai";
import { formatTime, getDecimalPlaces } from "@/math/utils";
import { useRouter } from "next/navigation";

export default function TopBar() {
    const [time, setTime] = useAtom(timeAtom);
    const setProblemAtom = useSetAtom(problemAtom);
    const router = useRouter();

    const quitGame = () => {
        router.push("/");
    }

    const skipQuestion = () => {
        setProblemAtom(prevProblem => prevProblem + 1);
        setTime(prevTime => prevTime + 3000); // penalty of 30s
    }

    return (
        <section className="flex justify-between items-center w-full p-3 relative">
            <Button onClick={quitGame}>Quit game</Button>
            <Timer cs={time} />
            <Button onClick={skipQuestion}>Skip question</Button>
        </section>
    )
}

type ButtonProps = {
    children: ReactNode,
    onClick: Trigger
}

function Button({ children, onClick }: ButtonProps) {
    return (
        <button 
            onClick={() => onClick()}
            className="text-red-500 font-medium py-1 px-2 bg-red-500/20 hover:bg-red-500/40 rounded-md"
        >
            {children}
        </button>
    )
}

type TimerProps = {
    cs: number
}

function Timer({ cs }: TimerProps) {
    return (
        <p className="text-lg font-bold absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
            {formatTime(cs)}s
        </p>
    )
}