"use client";

import clsx from "clsx";

interface WeightProps {
    type: "square" | "circle" | "triangle";
    color?: string;
}

export default function Weight({ type, color = "bg-blue-500" }: WeightProps) {

    if (type === "square") {
        return (
            <div className={clsx("w-16 h-16 rounded-md shadow-md border-b-4 border-black/10", color)} />
        );
    }

    if (type === "circle") {
        return (
            <div className={clsx("w-16 h-16 rounded-full shadow-md border-b-4 border-black/10", color)} />
        );
    }

    if (type === "triangle") {
        return (
            <div
                className="w-0 h-0 border-l-[32px] border-l-transparent border-b-[64px] border-b-amber-500 border-r-[32px] border-r-transparent drop-shadow-md"
            />
        );
    }

    return null;
}
