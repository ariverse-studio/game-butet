"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface NumberEntityProps {
    x: number;
    y: number;
    value: number;
    isPrime: boolean; // For debugging or visual hints (optional)
}

export default function NumberEntity({ x, y, value, isPrime }: NumberEntityProps) {
    // Center offset (half of width/height 64px = 32)
    const offset = 32;

    return (
        <motion.div
            className={clsx(
                "absolute flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-lg text-2xl font-bold select-none pointer-events-none z-20",
                isPrime
                    ? "bg-purple-100 border-purple-500 text-purple-700"
                    : "bg-yellow-100 border-yellow-500 text-yellow-700"
            )}
            style={{
                left: x - offset,
                top: y - offset,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
        >
            {value}
        </motion.div>
    );
}
