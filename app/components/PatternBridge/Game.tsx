"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, ArrowRight } from "lucide-react";
import BridgeChain from "./BridgeChain";
import Character from "./Character";
import { generatePattern, PatternData } from "./patternLogic";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti"; // You might need to install this type or just use window.confetti if available, but for now we'll assume basic confetti or skip

export default function PatternBridgeGame() {
    const [level, setLevel] = useState(1);
    const [data, setData] = useState<PatternData | null>(null);
    const [gameState, setGameState] = useState<"playing" | "success" | "fail">("playing");
    const [characterStatus, setCharacterStatus] = useState<"idle" | "walking" | "falling" | "success">("idle");
    const [progress, setProgress] = useState(0); // 0 = start, 1 = end

    // Initialize Level
    useEffect(() => {
        startLevel(level);
    }, [level]);

    const startLevel = (lvl: number) => {
        const newData = generatePattern(lvl);
        setData(newData);
        setGameState("playing");
        setCharacterStatus("idle");
        setProgress(0);
    };

    const handleOptionClick = (selected: number) => {
        if (!data || gameState !== "playing") return;

        if (selected === data.correctAnswer) {
            // Success!
            handleSuccess(selected);
        } else {
            // Fail!
            handleFail();
        }
    };

    const handleSuccess = (selected: number) => {
        // Fill the gap visually
        if (!data) return;
        const newSeq = [...data.sequence];
        newSeq[data.missingIndex] = selected;
        setData({ ...data, sequence: newSeq });

        // Animate Character
        setCharacterStatus("walking");
        setProgress(1); // Move to end

        setGameState("success");

        // Celebration
        setTimeout(() => {
            // Trigger generic confetti if we had the library, 
            // For now just visual delay
            setLevel(l => l + 1);
        }, 2000);
    };

    const handleFail = () => {
        // Determine where the character should stop (at the gap)
        if (!data) return;
        const gapPosition = data.missingIndex / (data.sequence.length - 1);

        // Walk to gap then fall
        setCharacterStatus("walking");
        setProgress(gapPosition);

        setTimeout(() => {
            setCharacterStatus("falling");
            setGameState("fail");
        }, 1000);
    };

    const retryLevel = () => {
        startLevel(level);
    };

    if (!data) return <div className="p-10">Loading...</div>;

    return (
        <div className="relative min-h-screen w-full bg-sky-200 overflow-hidden font-sans">

            {/* Background/Scenery */}
            <div className="absolute inset-0 z-0">
                {/* Sky */}
                <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-sky-400 to-sky-200" />
                {/* Mountains */}
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-300 to-transparent opacity-50" />
                {/* Clouds */}
                <motion.div
                    className="absolute top-10 left-10 text-white/50"
                    animate={{ x: [0, 100, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <div className="h-16 w-32 bg-white rounded-full blur-xl" />
                </motion.div>
            </div>

            {/* UI Overlay */}
            <div className="relative z-50 p-6 flex justify-between items-start">
                <Link href="/" className="p-3 bg-white/80 rounded-full hover:bg-white shadow-sm transition-all">
                    <ArrowLeft className="text-slate-700" />
                </Link>
                <div className="bg-white/80 px-6 py-2 rounded-full font-bold text-slate-700 shadow-sm flex gap-2">
                    Level {level}
                </div>
            </div>

            {/* Game Scene */}
            <div className="relative z-10 h-[60vh] flex items-center justify-center w-full max-w-5xl mx-auto">

                {/* Left Cliff */}
                <div className="absolute left-0 bottom-20 w-32 h-64 bg-stone-700 rounded-tr-3xl shadow-2xl" />

                {/* Bridge */}
                <div className="relative w-full px-32">
                    <BridgeChain sequence={data.sequence} />
                    {/* Character Layer - Absolute relative to this container or global? */}
                    {/* Let's make Character relative to the bridge start */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        {/* We need a better positioning strategy. 
                    Let's align it with the bridge container visually.
                */}
                    </div>
                </div>

                {/* Character (Global Positioning for simplicity) */}
                {/* Note: In a real game, we'd calculate exact coordinates. 
            Here we used percentage based movement in Character.tsx 
        */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center translate-y-[-70px]">
                    <div className="relative w-[800px] h-20"> {/* Match visual width of bridge approx */}
                        <Character status={characterStatus} progress={progress} />
                    </div>
                </div>

                {/* Right Cliff */}
                <div className="absolute right-0 bottom-20 w-32 h-64 bg-stone-700 rounded-tl-3xl shadow-2xl" />

                {/* Chasm Gradient */}
                <div className="absolute bottom-0 left-32 right-32 h-40 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Controls / Options */}
            <div className="relative z-50 h-[30vh] bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center justify-center gap-6">

                {gameState === "playing" && (
                    <>
                        <h2 className="text-2xl font-bold text-slate-600 mb-2">Complete the Pattern!</h2>
                        <div className="flex gap-4">
                            {data.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleOptionClick(opt)}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-3xl font-bold shadow-lg shadow-indigo-200 transition-transform hover:-translate-y-2 active:scale-95 flex items-center justify-center"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {gameState === "fail" && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-red-500 mb-4">Oops! You fell!</h2>
                        <button
                            onClick={retryLevel}
                            className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <RefreshCw /> Try Again
                        </button>
                    </div>
                )}

                {gameState === "success" && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-green-500 mb-4">Excellent!</h2>
                        <div className="text-slate-500 animate-pulse">Loading next level...</div>
                    </div>
                )}

            </div>
        </div>
    );
}
