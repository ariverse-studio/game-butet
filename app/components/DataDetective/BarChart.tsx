import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { DataPoint } from './dataLogic';

interface BarChartProps {
    data: DataPoint[];
    onBarClick: (id: string, value: number) => void;
    correctId: string | null; // To reveal answer if needed, or null
    selectedId: string | null; // Check user selection
    gameState: 'playing' | 'success' | 'error';
}

export default function BarChart({ data, onBarClick, correctId, selectedId, gameState }: BarChartProps) {
    // Determine Max Value for Y-Axis scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const axisMax = Math.ceil(maxValue / 10) * 10 + 20; // Add buffer

    return (
        <div className="w-full h-[300px] flex items-end justify-center gap-4 md:gap-8 p-4 relative bg-white rounded-xl border border-slate-100 shadow-sm">

            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 pb-8 opacity-20">
                <div className="border-b border-slate-900 w-full h-0" />
                <div className="border-b border-slate-900 w-full h-0" />
                <div className="border-b border-slate-900 w-full h-0" />
                <div className="border-b border-slate-900 w-full h-0" />
                <div className="border-b border-slate-900 w-full h-0" />
            </div>

            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-slate-400 font-mono py-4 pointer-events-none">
                <span>{axisMax}</span>
                <span>{Math.round(axisMax * 0.75)}</span>
                <span>{Math.round(axisMax * 0.5)}</span>
                <span>{Math.round(axisMax * 0.25)}</span>
                <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-around h-full pl-8 pb-6 relative z-10">
                {data.map((item) => {
                    const heightPercent = (item.value / axisMax) * 100;

                    const isSelected = selectedId === item.id;
                    const isCorrect = correctId === item.id;
                    const isWrong = isSelected && !isCorrect;

                    return (
                        <div key={item.id} className="h-full flex flex-col items-center justify-end gap-2 w-full max-w-[60px] cursor-pointer group"
                            onClick={() => onBarClick(item.id, item.value)}
                        >
                            {/* Value Label (Hover) */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 font-bold text-sm mb-1">
                                {item.value}
                            </div>

                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{
                                    height: `${heightPercent}%`,
                                    borderColor: isCorrect && gameState === 'success' ? '#10b981' : isWrong && gameState === 'error' ? '#ef4444' : 'transparent',
                                    borderWidth: (isCorrect && gameState === 'success') || (isWrong && gameState === 'error') ? 4 : 0
                                }}
                                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={clsx(
                                    "w-full rounded-t-lg shadow-sm transition-all",
                                    item.color,
                                    (isCorrect && gameState === 'success') && "brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.5)]",
                                    (isWrong && gameState === 'error') && "animate-shake bg-red-500" // Override color on error? Maybe just shake.
                                )}
                            />

                            {/* X-Axis Label */}
                            <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                                {item.label}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
