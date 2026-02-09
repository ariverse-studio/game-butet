"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Zap, BatteryLow, ArrowUpRight } from "lucide-react";
import { useCoins } from "../../context/CoinContext";

interface Quantity {
    id: number;
    text: string;
    type: "scalar" | "vector";
    hint: string;
}

const QUANTITIES: Quantity[] = [
    { id: 1, text: "Mass (5kg)", type: "scalar", hint: "Only magnitude, no direction." },
    { id: 2, text: "Velocity (50km/h North)", type: "vector", hint: "Has both speed and direction." },
    { id: 3, text: "Temperature (30°C)", type: "scalar", hint: "Direction doesn't matter for heat." },
    { id: 4, text: "Force (10N Down)", type: "vector", hint: "Force always acts in a direction." },
    { id: 5, text: "Distance (10 meters)", type: "scalar", hint: "Just length, no direction specified." },
    { id: 6, text: "Displacement (10m East)", type: "vector", hint: "The length and direction from start." },
    { id: 7, text: "Time (10 seconds)", type: "scalar", hint: "Time flows, it doesn't have a 'direction' in space." },
    { id: 8, text: "Acceleration (9.8m/s² Down)", type: "vector", hint: "Change in velocity involves direction." },
    { id: 9, text: "Speed (60 km/h)", type: "scalar", hint: "Just a rate, no direction specified." },
    { id: 10, text: "Pressure (101 kPa)", type: "scalar", hint: "Acts in all directions equally at a point." },
    { id: 11, text: "Momentum (20 kg·m/s Right)", type: "vector", hint: "Product of mass and velocity." },
    { id: 12, text: "Energy (500 Joules)", type: "scalar", hint: "Capacity to do work, no direction." },
    { id: 13, text: "Weight (600N Down)", type: "vector", hint: "Gravity's pull in a specific direction." },
    { id: 14, text: "Volume (2 Liters)", type: "scalar", hint: "Amount of space occupied." },
    { id: 15, text: "Field Strength (5 N/C North)", type: "vector", hint: "Electric field has a specific direction." },
    { id: 16, text: "Power (150 Watts)", type: "scalar", hint: "Rate of energy transfer." },
    { id: 17, text: "Density (1000 kg/m³)", type: "scalar", hint: "Mass per unit volume." },
    { id: 18, text: "Torque (10 N·m Clockwise)", type: "vector", hint: "Rotational force has an axis/direction." },
    { id: 19, text: "Work (100 Joules)", type: "scalar", hint: "Dot product of force and displacement." },
    { id: 20, text: "Area (25 m²)", type: "scalar", hint: "Magnitude of a surface." },
    { id: 21, text: "Impulse (5 N·s Up)", type: "vector", hint: "Change in momentum has direction." },
    { id: 22, text: "Electric Current (5A)", type: "scalar", hint: "Charge flow per unit time (scalar in basic physics)." },
];

export default function SortingStation({ onComplete }: { onComplete: () => void }) {
    const { addCoins } = useCoins();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [progress, setProgress] = useState(0);

    const handleAnswer = (type: "scalar" | "vector") => {
        if (feedback) return;

        const correct = QUANTITIES[currentIdx].type === type;
        setFeedback(correct ? "correct" : "wrong");

        if (correct) {
            setScore((prev) => prev + 1);
            setProgress((prev) => Math.min(prev + (100 / 5), 100));
            addCoins(5);
        }

        setTimeout(() => {
            setFeedback(null);
            if (score + (correct ? 1 : 0) >= 5) {
                onComplete();
            } else {
                // Pick a new random quantity that isn't the current one
                let nextIdx;
                do {
                    nextIdx = Math.floor(Math.random() * QUANTITIES.length);
                } while (nextIdx === currentIdx);
                setCurrentIdx(nextIdx);
            }
        }, 1200);
    };

    const currentQuantity = QUANTITIES[currentIdx];

    return (
        <div className="max-w-2xl mx-auto px-6 flex flex-col items-center justify-center min-h-[70vh]">
            {/* Progress Bar */}
            <div className="w-full mb-12">
                <div className="flex justify-between items-end mb-3">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Progress</span>
                        <h4 className="font-black text-slate-900">Theory Validation</h4>
                    </div>
                    <span className="text-indigo-600 font-black">{Math.floor(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-white rounded-full border border-slate-100 overflow-hidden p-0.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                    />
                </div>
            </div>

            {/* Card Stack */}
            <div className="relative w-full aspect-video flex items-center justify-center mb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIdx}
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 1.1, opacity: 0, y: -20 }}
                        className={`w-full h-full bg-white rounded-[2.5rem] border-2 flex flex-col items-center justify-center p-12 text-center shadow-2xl shadow-indigo-500/5 ${feedback === "correct" ? "border-green-500 bg-green-50/50" :
                            feedback === "wrong" ? "border-red-500 bg-red-50/50" : "border-slate-100"
                            }`}
                    >
                        <div className={`p-4 rounded-3xl mb-6 ${feedback === "correct" ? "bg-green-100 text-green-600" :
                            feedback === "wrong" ? "bg-red-100 text-red-600" : "bg-slate-50 text-slate-400"
                            }`}>
                            {feedback === "correct" ? <CheckCircle2 size={40} /> :
                                feedback === "wrong" ? <XCircle size={40} /> : <Zap size={40} />}
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-none">
                            {currentQuantity.text}
                        </h3>
                        <p className={`text-sm font-medium transition-colors ${feedback ? "opacity-100" : "opacity-40"}`}>
                            {feedback ? currentQuantity.hint : "Classify this physical quantity."}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                <button
                    onClick={() => handleAnswer("scalar")}
                    disabled={!!feedback}
                    className="group relative h-24 bg-white hover:bg-slate-50 border border-slate-100 rounded-4xl shadow-sm flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <BatteryLow size={20} />
                    </div>
                    <span className="font-black text-slate-900 text-sm tracking-widest uppercase">Scalar</span>
                </button>

                <button
                    onClick={() => handleAnswer("vector")}
                    disabled={!!feedback}
                    className="group relative h-24 bg-white hover:bg-slate-50 border border-slate-100 rounded-4xl shadow-sm flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-2 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <ArrowUpRight size={20} />
                    </div>
                    <span className="font-black text-slate-900 text-sm tracking-widest uppercase">Vector</span>
                </button>
            </div>
        </div>
    );
}
