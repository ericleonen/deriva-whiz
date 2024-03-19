import { NUM_PROBLEMS } from "@/config";
import Modal from "./Modal";
import { useSetAtom } from "jotai";
import { gameActiveAtom } from "../../atoms";

export default function HowTo() {
    const setGameActive = useSetAtom(gameActiveAtom);

    return (
        <Modal>
            <h2 className="font-bold text-lg">How to play</h2>
            <p className="mt-3">
                Solve the {NUM_PROBLEMS} derivatives as fast as you can.
                <br />
                <br />
                If you cannot solve derivative, skip it by hitting <span className="text-xs text-red-500 font-medium py-1 px-2 bg-red-500/20 rounded-md">Skip question</span> in the upper right
            </p>
            <button 
                onClick={() => setGameActive(true)}
                className="mt-10 font-medium bg-green-400/20 hover:bg-green-400/40 text-green-500 py-2 px-8 rounded-md"
            >
                Begin!
            </button>
        </Modal>
    )
}