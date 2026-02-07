"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, X } from "lucide-react";
import clsx from "clsx";
import { useSound } from "../hooks/useSound";
import { useEffect } from "react";

interface GameFooterProps {
    status: "idle" | "correct" | "wrong";
    isCheckDisabled?: boolean;
    onCheck: () => void;
    onContinue: () => void;
    message?: string;
}

export default function GameFooter({
    status,
    isCheckDisabled,
    onCheck,
    onContinue,
    message
}: GameFooterProps) {

    const playSuccess = useSound("https://cdn.pixabay.com/audio/2021/08/09/audio_7232134569.mp3");
    const playError = useSound("https://cdn.pixabay.com/audio/2025/05/31/audio_e9d22d9131.mp3");

    useEffect(() => {
        if (status === "correct") {
            playSuccess();
        } else if (status === "wrong") {
            playError();
        }
    }, [status, playSuccess, playError]);

    return (
        <div className={clsx(
            "fixed bottom-0 left-0 w-full p-4 border-t-2 transition-colors duration-300 z-50",
            status === "correct" ? "bg-emerald-100 border-emerald-200" :
                status === "wrong" ? "bg-red-100 border-red-200" : "bg-white border-slate-200"
        )}>
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">

                {/* Feedback Text */}
                <div className="flex-1 font-bold text-xl">
                    <AnimatePresence mode="wait">
                        {status === "correct" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-emerald-700 flex items-center gap-2"
                            >
                                <div className="p-1 bg-emerald-500 rounded-full text-white">
                                    <Check size={20} strokeWidth={4} />
                                </div>
                                {message || "Excellent!"}
                            </motion.div>
                        )}
                        {status === "wrong" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-600 flex items-center gap-2"
                            >
                                <div className="p-1 bg-red-500 rounded-full text-white">
                                    <X size={20} strokeWidth={4} />
                                </div>
                                {message || "Try Again"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Button - Duolingo Style */}
                <button
                    onClick={status === "correct" ? onContinue : onCheck}
                    disabled={status === "idle" && isCheckDisabled}
                    className={clsx(
                        "px-8 py-3 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 min-w-[160px] justify-center uppercase tracking-wide",
                        // General Button Shape with 3D effect (border-b-4)
                        "border-b-4 active:border-b-0 active:translate-y-1",

                        // Variants
                        status === "correct"
                            ? "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400"
                            : status === "wrong"
                                ? "bg-red-500 border-red-700 text-white hover:bg-red-400"
                                : isCheckDisabled
                                    ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed active:border-b-4 active:translate-y-0"
                                    : "bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400"
                    )}
                >
                    {status === "correct" ? (
                        <>Continue <ArrowRight size={24} strokeWidth={3} /></>
                    ) : status === "wrong" ? (
                        <>Refine</>
                    ) : (
                        <>Check</>
                    )}
                </button>

            </div>
        </div>
    );
}
