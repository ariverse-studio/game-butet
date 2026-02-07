"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import clsx from "clsx";

interface GameTimerProps {
    duration: number; // in seconds
    onTimeUp: () => void;
    isRunning?: boolean;
    resetKey?: any; // Change this prop to reset the timer
}

export default function GameTimer({ duration, onTimeUp, isRunning = true, resetKey }: GameTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration, resetKey]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onTimeUp]);

    const progress = (timeLeft / duration) * 100;
    const isLow = timeLeft <= 10;

    return (
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm min-w-[140px]">
            <Clock size={18} className={clsx("transition-colors", isLow ? "text-red-500 animate-pulse" : "text-slate-400")} />

            <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-end text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Time</span>
                    <span className={clsx("text-sm", isLow ? "text-red-500" : "text-slate-700")}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                        className={clsx(
                            "h-full rounded-full transition-colors",
                            isLow ? "bg-red-500" : "bg-sky-500"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
