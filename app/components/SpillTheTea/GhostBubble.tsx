"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Send, Trash2 } from "lucide-react";

interface GhostBubbleProps {
    text: string;
    onChoice: (isValid: boolean) => void;
}

export default function GhostBubble({ text, onChoice }: GhostBubbleProps) {
    const x = useMotionValue(0);
    const [choice, setChoice] = useState<"left" | "right" | null>(null);

    // Transform background color based on drag position
    const backgroundColor = useTransform(
        x,
        [-150, -50, 0, 50, 150],
        [
            "rgba(239, 68, 68, 0.8)", // Red-500
            "rgba(255, 255, 255, 0.5)",
            "rgba(255, 255, 255, 0.4)",
            "rgba(255, 255, 255, 0.5)",
            "rgba(16, 185, 129, 0.8)"  // Emerald-500
        ]
    );

    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const rotate = useTransform(x, [-150, 150], [-10, 10]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            onChoice(true); // Valid
        } else if (info.offset.x < -100) {
            onChoice(false); // Invalid
        }
    };

    return (
        <div className="relative w-full flex justify-end pr-2">
            {/* Background Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none opacity-30">
                <Trash2 className="w-8 h-8 text-red-500" />
                <Send className="w-8 h-8 text-emerald-500" />
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                style={{ x, backgroundColor, opacity, rotate }}
                onDrag={(e, info) => {
                    if (info.offset.x > 50) setChoice("right");
                    else if (info.offset.x < -50) setChoice("left");
                    else setChoice(null);
                }}
                onDragEnd={handleDragEnd}
                className="relative max-w-[80%] p-3 rounded-2xl rounded-tr-none border-2 border-dashed border-zinc-400 dark:border-zinc-500 text-sm italic text-zinc-600 dark:text-zinc-300 cursor-grab active:cursor-grabbing shadow-lg backdrop-blur-sm"
            >
                {text}

                {/* Visual Indicators */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    {choice === "right" && (
                        <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-emerald-500 font-bold text-xs uppercase flex items-center gap-1">
                            <Send className="w-3 h-3" /> Valid (Send)
                        </motion.span>
                    )}
                    {choice === "left" && (
                        <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 font-bold text-xs uppercase flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Hoax (Delete)
                        </motion.span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
