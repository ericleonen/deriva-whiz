import { LayoutProps } from "@/types";

export default function PlayLayout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col w-screen h-screen">
            {children}
        </div>
    )
}