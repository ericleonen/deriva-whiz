"use client"

import { useAtomValue } from "jotai";
import HowTo from "./components/modals/HowTo";
import Game from "./components/Game";
import { NUM_PROBLEMS } from "@/config";
import GameOver from "./components/modals/GameOver";
import { addStyles } from "react-mathquill";
import { gameActiveAtom, problemAtom } from "./atoms";

if (typeof window !== "undefined") {
    addStyles();
}

export default function Play() {
    const problem = useAtomValue(problemAtom);
    const gameActive = useAtomValue(gameActiveAtom);

    return (
        gameActive ? <Game /> :
        problem < NUM_PROBLEMS ? <HowTo /> :
        <GameOver />
    );
}