"use client";

import { motion, Variants } from "framer-motion";
import { Smile } from "lucide-react";

interface CharacterProps {
    status: "idle" | "walking" | "falling" | "success";
    progress: number; // 0 to 1 (across the bridge)
}

export default function Character({ status, progress }: CharacterProps) {

    // Calculate position based on progress
    // Calculate position based on progress in %
    const xOffsetPercent = progress * 80; // Assuming 80% coverage

    return (
        <motion.div
            className="absolute z-20 text-indigo-600"
            animate={{
                x: `${xOffsetPercent}%`,
                y: status === "falling" ? 400 : 0,
                rotate: status === "falling" ? 360 : 0,
                scale: status === "falling" ? 0 : 1
            }}
            transition={{
                type: "spring",
                stiffness: status === "walking" ? 50 : 100,
                damping: 20,
                duration: status === "falling" ? 1 : 0.5
            }}
            style={{
                left: "10%", // Starting position on the left cliff
                top: "35%"   // Align with bridge
            }}
        >
            <div className="relative">
                <motion.div
                    animate={status === "walking" ? { y: [0, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                >
                    <Smile size={48} fill="currentColor" className="text-yellow-400 sm:size-64 drop-shadow-md" />
                </motion.div>

                {/* Simple Body */}
                <div className="w-8 h-12 bg-indigo-500 mx-auto rounded-full -mt-2 shadow-sm" />
                {/* Legs */}
                <motion.div
                    className="w-10 h-2 bg-black/20 mx-auto rounded-full mt-1 blur-sm"
                    animate={{ scale: status === "walking" ? 0.8 : 1 }}
                />
            </div>
        </motion.div>
    );
}
