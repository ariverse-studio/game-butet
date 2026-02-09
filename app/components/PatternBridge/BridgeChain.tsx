"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface BridgeChainProps {
    sequence: (number | null)[];
}

export default function BridgeChain({ sequence }: BridgeChainProps) {
    return (
        <div className="flex gap-4 items-center justify-center relative z-10">
            {/* Rope/Support Line */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-amber-800 -z-10 rounded-full" />

            {sequence.map((num, idx) => (
                <motion.div
                    key={idx}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={clsx(
                        "w-12 h-12 sm:w-24 sm:h-24 flex items-center justify-center rounded-lg shadow-xl border-b-4 sm:border-b-8 text-xl sm:text-3xl font-bold transition-all",
                        num === null
                            ? "bg-white/20 border-white/10 text-transparent border-dashed border-2 sm:border-4" // Ghost stone
                            : "bg-stone-200 border-stone-400 text-stone-700"
                    )}
                >
                    {num !== null ? num : "?"}
                </motion.div>
            ))}
        </div>
    );
}
