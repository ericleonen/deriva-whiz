"use client"

import { LayoutProps } from "@/types";
import { Provider } from "jotai";

export default function Providers({ children }: LayoutProps) {
    return (
        <Provider>
            {children}
        </Provider>
    )
}