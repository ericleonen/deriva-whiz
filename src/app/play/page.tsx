"use client"

import { useAtomValue } from "jotai";
import HowTo from "./components/modals/HowTo";
import { NUM_PROBLEMS } from "@/config";
import GameOver from "./components/modals/GameOver";
import { gameActiveAtom, problemAtom } from "./atoms";
import dynamic from "next/dynamic";

const Game = dynamic(
    () => import("./components/Game"),
    {ssr: false}
)

export default function Play() {
    const problem = useAtomValue(problemAtom);
    const gameActive = useAtomValue(gameActiveAtom);

    return (
        gameActive ? <Game /> :
        problem < NUM_PROBLEMS ? <HowTo /> :
        <GameOver />
    );
}