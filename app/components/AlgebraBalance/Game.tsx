"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Scale from "./Scale";
import Weight from "./Weight";
import confetti from "canvas-confetti";
import GameFooter from "../GameFooter";
import clsx from "clsx";

interface LevelState {
    itemWeight: number;
    itemCount: number;
    totalWeight: number;
    options: number[];
    shape: "square" | "circle" | "triangle";
    color: string;
}

export default function AlgebraBalanceGame() {
    const [level, setLevel] = useState(1);
    const [gameState, setGameState] = useState<LevelState | null>(null);

    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

    useEffect(() => {
        startLevel(level);
    }, [level]);

    const startLevel = (lvl: number) => {
        setStatus("idle");
        setSelectedOption(null);

        // Generate puzzle: n * x = total
        const itemCount = Math.floor(Math.random() * 3) + 2;

        const maxX = Math.min(9 + lvl * 2, 50);
        const itemWeight = Math.floor(Math.random() * (maxX - 2)) + 2;

        const totalWeight = itemCount * itemWeight;

        // Generate Options
        const options = new Set<number>();
        options.add(itemWeight);
        while (options.size < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const val = itemWeight + offset;
            if (val > 0 && val !== itemWeight) options.add(val);
        }

        const shapes: ("square" | "circle" | "triangle")[] = ["square", "circle", "triangle"];
        const colors = ["bg-blue-500", "bg-red-500", "bg-purple-500", "bg-amber-500"];

        setGameState({
            itemWeight,
            itemCount,
            totalWeight,
            options: Array.from(options).sort((a, b) => a - b),
            shape: shapes[lvl % 3],
            color: colors[lvl % 4]
        });
    };

    const checkAnswer = () => {
        if (!gameState || selectedOption === null) return;

        if (status === "wrong") {
            // Reset status to allow checking again
            setStatus("idle");
            // Optionally clear selection? Let's keep it to allow quick change
            return;
        }

        if (selectedOption === gameState.itemWeight) {
            setStatus("correct");
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setStatus("wrong");
        }
    };

    const handleContinue = () => {
        setLevel(l => l + 1);
    };

    if (!gameState) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col pb-24">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white shadow-sm sticky top-0 z-40">
                <Link href="/" className="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-all">
                    <ArrowLeft className="text-slate-600" />
                </Link>
                <div className="text-xl font-bold text-slate-600">
                    Level {level}
                </div>
                <div className="w-10" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full gap-8 sm:gap-12">

                {/* Question */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        What is the weight of one {gameState.shape}?
                    </h1>
                    <p className="text-slate-500">
                        Total weight is {gameState.totalWeight}
                    </p>
                </div>

                {/* The Digital Scale */}
                <div className="py-4">
                    <Scale reading={gameState.totalWeight}>
                        {Array.from({ length: gameState.itemCount }).map((_, i) => (
                            <Weight key={i} type={gameState.shape} color={gameState.color} />
                        ))}
                    </Scale>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    {gameState.options.map(opt => (
                        <button
                            key={opt}
                            onClick={() => {
                                if (status !== 'correct') {
                                    setSelectedOption(opt);
                                    setStatus('idle');
                                }
                            }}
                            className={clsx(
                                "py-6 rounded-2xl text-3xl font-bold transition-all border-2 border-b-4 active:border-b-0 active:translate-y-1",
                                selectedOption === opt
                                    ? "border-slate-700 border-b-slate-900 bg-slate-800 text-white"
                                    : "border-slate-200 border-b-slate-300 bg-white text-slate-700 hover:bg-slate-50"
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
            />

        </div>
    );
}
