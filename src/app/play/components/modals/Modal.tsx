import { LayoutProps } from "@/types";

export default function Modal({ children }: LayoutProps) {
    return (
        <div className="w-screen h-screen absolute top-0 left-0 bg-black/50 flex items-center justify-center z-[200]">
            <div className="flex flex-col bg-white rounded-md p-10 items-center max-w-[400px]">
                {children}
            </div>
        </div>
    )
}