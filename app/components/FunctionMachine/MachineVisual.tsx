import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface MachineVisualProps {
    input: number | null;
    output: number | null;
    isProcessing: boolean;
    state: 'idle' | 'success' | 'error';
}

export default function MachineVisual({ input, output, isProcessing, state }: MachineVisualProps) {
    return (
        <div className="relative flex items-center justify-center gap-2 sm:gap-4 h-40 sm:h-48 w-full max-w-2xl">

            {/* Input Slot (Left) */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                <AnimatePresence>
                    {input !== null && !isProcessing && output === null && (
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl sm:text-4xl font-bold text-slate-700 bg-white shadow-md rounded-lg w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border border-slate-200"
                        >
                            {input}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* The Machine (Center) */}
            <motion.div
                animate={
                    state === 'error' ? { x: [-5, 5, -5, 5, 0] } :
                        state === 'success' ? { scale: [1, 1.1, 1] } :
                            isProcessing ? { scale: [1, 1.02, 1] } : {}
                }
                transition={{ duration: 0.4 }}
                className={clsx(
                    "relative z-10 w-32 sm:w-48 h-24 sm:h-32 rounded-2xl flex flex-col items-center justify-center shadow-xl transition-colors duration-300",
                    state === 'error' ? "bg-red-500 shadow-red-200" :
                        state === 'success' ? "bg-emerald-500 shadow-emerald-200" :
                            "bg-indigo-600 shadow-indigo-200"
                )}
            >
                {/* Inner Bezel */}
                <div className="w-24 sm:w-40 h-16 sm:h-24 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <div className="text-white text-lg sm:text-2xl font-black tracking-widest flex items-center gap-2">
                        <Settings className={isProcessing ? "animate-spin" : ""} size={20} />
                        ƒ(x)
                    </div>
                </div>

                {/* Status Light */}
                <div className={clsx(
                    "absolute top-2 right-2 w-3 h-3 rounded-full",
                    isProcessing ? "bg-yellow-400 animate-pulse" :
                        state === 'success' ? "bg-white" :
                            state === 'error' ? "bg-black/20" :
                                "bg-green-400"
                )} />
            </motion.div>

            {/* Output Slot (Right) */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center">
                <AnimatePresence>
                    {output !== null && (
                        <motion.div
                            initial={{ x: -50, opacity: 0, scale: 0.5 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring" }}
                            className="text-2xl sm:text-4xl font-bold text-white bg-indigo-500 shadow-md rounded-lg w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border border-indigo-400"
                        >
                            {output}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
