"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { generatePattern, PatternData } from "./patternLogic";
import BridgeChain from "./BridgeChain";
import Character from "./Character";
import confetti from "canvas-confetti";
import GameFooter from "../GameFooter";
import clsx from "clsx";
import { useSound } from "../../hooks/useSound";
import { useCoins } from "../../context/CoinContext";
import GameTimer from "../GameTimer";
import { useSettings } from "../../context/SettingsContext";

export default function PatternBridgeGame() {
    const { addCoins } = useCoins();
    const { defaultTime } = useSettings();
    const [level, setLevel] = useState(1);
    const [pattern, setPattern] = useState<PatternData | null>(null);
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");

    // Game State
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [characterStatus, setCharacterStatus] = useState<"idle" | "walking" | "falling" | "success">("idle");
    const [walkProgress, setWalkProgress] = useState(0); // 0 to 100%

    // Initialize Level
    useEffect(() => {
        const data = generatePattern(level);
        setPattern(data);
        setStatus("idle");
        setSelectedOption(null);
        setCharacterStatus("idle");
        setWalkProgress(0);
    }, [level]);

    const checkAnswer = () => {
        if (!pattern || selectedOption === null) return;

        if (status === "wrong") {
            // If they click 'Try Again', we basically adjust state to allow retrying
            setStatus("idle");
            setCharacterStatus("idle");
            setWalkProgress(0);
            return;
        }

        if (selectedOption === pattern.missingNumber) {
            handleSuccess();
        } else {
            handleFail();
        }
    };

    const handleSuccess = () => {
        setStatus("correct");
        addCoins(50);
        setCharacterStatus("walking");
        // Animate walking
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setWalkProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setCharacterStatus("success");
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
        }, 30);
    };

    const handleFail = () => {
        setStatus("wrong");
        setCharacterStatus("walking");
        // Animate walking to gap then fall
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setWalkProgress(p);
            if (p >= 60) { // Assuming gap is roughly at 60% visually or logic-wise
                clearInterval(interval);
                setCharacterStatus("falling");
            }
        }, 30);
    };

    const handleContinue = () => {
        setLevel(l => l + 1);
    };

    const resetLevel = () => {
        const data = generatePattern(level);
        setPattern(data);
        setStatus("idle");
        setSelectedOption(null);
        setCharacterStatus("idle");
        setWalkProgress(0);
    };

    if (!pattern) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-sky-100 font-sans text-slate-800 flex flex-col pb-24 overflow-hidden">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-3 bg-white rounded-full hover:shadow-md transition-all">
                        <ArrowLeft className="text-slate-600" />
                    </Link>
                    <GameTimer
                        key={level} // Reset on level change
                        duration={defaultTime}
                        onTimeUp={handleFail}
                        isRunning={status === "idle"}
                    />
                </div>
                <div className="text-xl font-bold text-slate-600">
                    Level {level}
                </div>
                <button onClick={resetLevel} className="p-3 bg-white rounded-full hover:shadow-md hover:text-sky-600 transition-all">
                    <RefreshCw size={20} />
                </button>
            </div>

            <main className="flex-1 flex flex-col items-center relative">

                {/* Rule Hint */}
                <div className="mt-8 mb-4 px-6 py-2 bg-white/80 rounded-full text-slate-600 font-medium shadow-sm backdrop-blur">
                    Wait, what comes next?
                </div>

                {/* The Scene */}
                <div className="w-full max-w-4xl h-[300px] sm:h-[400px] relative flex items-center justify-center">

                    {/* Cliffs */}
                    <div className="absolute left-0 bottom-10 sm:bottom-20 w-20 sm:w-32 h-48 sm:h-64 bg-stone-700 rounded-r-3xl" />
                    <div className="absolute right-0 bottom-10 sm:bottom-20 w-20 sm:w-32 h-48 sm:h-64 bg-stone-700 rounded-l-3xl" />

                    {/* Bridge */}
                    <div className="relative z-10 w-full px-12 sm:px-20">
                        <BridgeChain sequence={pattern.sequence} />
                    </div>

                    {/* Character */}
                    <div className="absolute left-10 bottom-[10rem] sm:bottom-[14rem] z-20 pointer-events-none"
                        style={{
                            left: `calc(10% + ${walkProgress * 0.8}%)`,
                            transition: 'left 0.1s linear'
                        }}
                    >
                        <Character status={characterStatus} progress={walkProgress} />
                    </div>

                </div>

                {/* Options */}
                <div className="w-full max-w-2xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-[-60px] relative z-30">
                    {pattern.options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => {
                                if (status !== 'correct') {
                                    playClick();
                                    setSelectedOption(opt);
                                    if (status === 'wrong') setStatus('idle'); // Reset wrong state explicitly if clicking new option
                                    setCharacterStatus('idle'); // Reset character
                                    setWalkProgress(0);
                                }
                            }}
                            className={clsx(
                                "py-4 rounded-2xl text-2xl font-bold transition-all border-2 border-b-4 active:border-b-0 active:translate-y-1",
                                selectedOption === opt
                                    ? "bg-sky-500 border-sky-600 border-b-sky-800 text-white"
                                    : "bg-white border-slate-200 border-b-slate-300 text-slate-700 hover:bg-slate-50"
                            )}
                        >
                            {opt}
                        </button>
                    ))}
                </div>

            </main>

            <GameFooter
                status={status}
                isCheckDisabled={selectedOption === null}
                onCheck={checkAnswer}
                onContinue={handleContinue}
                message={status === "wrong" ? "Oops! The bridge broke!" : undefined}
            />

        </div>
    );
}
