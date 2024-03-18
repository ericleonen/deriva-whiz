import { useAtom, useSetAtom } from "jotai";
import Modal from "./Modal";
import { gameActiveAtom, problemAtom, timeAtom } from "../../page";
import { formatTime } from "@/math/utils";

export default function GameOver() {
    const setGameActive = useSetAtom(gameActiveAtom);
    const setProblem = useSetAtom(problemAtom);
    const [time, setTime] = useAtom(timeAtom);

    const reset = () => {
        setGameActive(false);
        setProblem(0);
        setTime(0);
    }

    return (
        <Modal>
            <h2 className="font-bold text-lg">You finished!</h2>
            <p className="font-medium mt-3"><span className="font-bold">Your time:</span> {formatTime(time)}s</p>
            <button 
                onClick={reset}
                className="mt-10 font-medium bg-green-400/20 hover:bg-green-400/40 text-green-500 py-2 px-8 rounded-md"
            >
                Play again
            </button>
        </Modal>
    )
}