"use client"

import { useAtomValue } from "jotai";
import HowTo from "./components/modals/HowTo";
import Game from "./components/Game";
import { NUM_PROBLEMS } from "@/config";
import GameOver from "./components/modals/GameOver";
import { addStyles } from "react-mathquill";
import { gameActiveAtom, problemAtom } from "./atoms";
import { useEffect } from "react";

export default function Play() {
    useEffect(() => {
        addStyles();
    }, []);

    const problem = useAtomValue(problemAtom);
    const gameActive = useAtomValue(gameActiveAtom);

    return (
        gameActive ? <Game /> :
        problem < NUM_PROBLEMS ? <HowTo /> :
        <GameOver />
    );
}