"use client"

import { LayoutProps } from "@/types";
import { addStyles } from "react-mathquill";

if (window !== undefined) {
    addStyles();
}

export default function PlayLayout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col w-screen h-screen">
            {children}
        </div>
    )
}