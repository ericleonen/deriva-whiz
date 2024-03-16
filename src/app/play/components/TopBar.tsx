import { Trigger } from "@/types"
import { ReactNode } from "react"

export default function TopBar() {
    return (
        <section className="flex justify-between items-center w-full p-3 relative">
            <Button onClick={() => {}}>Quit game</Button>
            <Timer cs={1005} />
            <Button onClick={() => {}}>Skip question</Button>
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
        <p className="text-lg font-bold absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">{cs / 100}s</p>
    )
}