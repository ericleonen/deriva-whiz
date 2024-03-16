"use client"

import { LayoutProps } from "@/types";
import { useEffect } from "react";
import { addStyles } from "react-mathquill";

export default function PlayLayout({ children }: LayoutProps) {
    useEffect(() => {
        addStyles();
    }, []);

    return (
        <div className="flex flex-col w-screen h-screen">
            {children}
        </div>
    )
}