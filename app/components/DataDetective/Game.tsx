"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy, BarChart2 } from "lucide-react";
import { useCoins } from "../../context/CoinContext";
import { useSound } from "../../hooks/useSound";
import { generateChartData, generateQuestion, DataPoint, Question } from "./dataLogic";
import BarChart from "./BarChart";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function DataDetectiveGame() {
    const { addCoins } = useCoins();

    // SFX
    const playSuccess = useSound("https://cdn.pixabay.com/audio/2021/08/09/audio_7232134569.mp3");
    const playFail = useSound("https://cdn.pixabay.com/audio/2025/05/31/audio_e9d22d9131.mp3");
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");

    // Game State
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [data, setData] = useState<DataPoint[]>([]);
    const [question, setQuestion] = useState<Question | null>(null);
    const [gameState, setGameState] = useState<"playing" | "success" | "error">("playing");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Initialize Level
    useEffect(() => {
        startLevel();
    }, [level]);

    const startLevel = () => {
        const newData = generateChartData(level);
        setData(newData);
        setQuestion(generateQuestion(newData));
        setGameState("playing");
        setSelectedId(null);
    };

    const handleBarClick = (id: string, value: number) => {
        if (gameState !== 'playing' || !question) return;

        playClick();
        setSelectedId(id);

        if (id === question.correctId) {
            // Correct!
            playSuccess();
            setGameState("success");
            setScore(s => s + 15);
            addCoins(15);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#f59e0b']
            });
        } else {
            // Wrong!
            playFail();
            setGameState("error");
            setTimeout(() => {
                setGameState("playing");
                setSelectedId(null);
            }, 800);
        }
    };

    const nextLevel = () => {
        setLevel(l => l + 1);
    };

    if (!question) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Header */}
            <header className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <div className="font-bold text-slate-600 text-lg tracking-wider flex items-center gap-2">
                    <BarChart2 className="text-sky-500" /> DATA DETECTIVE <span className="bg-sky-100 text-sky-600 px-2 py-0.5 rounded text-sm ml-2">Score: {score}</span>
                </div>
                <button onClick={startLevel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <RefreshCw size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 gap-8 max-w-4xl mx-auto w-full">

                {/* Question Card */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center"
                >
                    <h2 className="text-2xl font-bold text-slate-700 leading-relaxed max-w-2xl mx-auto">
                        {question.text}
                    </h2>
                </motion.div>

                {/* Chart Area */}
                <BarChart
                    data={data}
                    onBarClick={handleBarClick}
                    correctId={question.correctId}
                    selectedId={selectedId}
                    gameState={gameState}
                />

                {/* Feedback / Controls */}
                <div className="h-20 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {gameState === 'success' && (
                            <motion.button
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                onClick={nextLevel}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-xl shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                Correct! Next Level <ArrowLeft className="rotate-180" />
                            </motion.button>
                        )}
                        {gameState === 'error' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-500 font-bold text-lg"
                            >
                                Oops! Look closely at the chart...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
}
