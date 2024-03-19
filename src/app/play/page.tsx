"use client"

import { atom, useAtomValue } from "jotai";
import HowTo from "./components/modals/HowTo";
import Game from "./components/Game";
import { NUM_PROBLEMS } from "@/config";
import GameOver from "./components/modals/GameOver";
import { addStyles } from "react-mathquill";

export const timeAtom = atom(0); // in centiseconds
export const problemAtom = atom(0);
export const gameActiveAtom = atom(false);

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