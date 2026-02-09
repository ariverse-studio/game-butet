"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import SortingStation from "./SortingStation";
import VectorMission from "./VectorMission";
import { useCoins } from "../../context/CoinContext";

export type GameStage = "menu" | "stage1" | "stage2" | "gameover";

export default function VectorValley() {
    const [stage, setStage] = useState<GameStage>("menu");
    const [score, setScore] = useState(0);
    const { totalCoins } = useCoins();

    const startGame = () => {
        setScore(0);
        setStage("stage1");
    };

    const handleStage1Complete = () => {
        setStage("stage2");
    };

    const handleGameComplete = (finalScore: number) => {
        setScore((prev) => prev + finalScore);
        setStage("gameover");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
            {/* Header / HUD */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/simulation" className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">Vector Valley</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Physics & Math Minigame</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <Trophy size={18} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Coins</p>
                            <p className="text-sm font-black text-slate-900 leading-none mt-1">{totalCoins}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Content */}
            <main className="h-full pt-24">
                <AnimatePresence mode="wait">
                    {stage === "menu" && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] px-8 text-center"
                        >
                            <div className="w-24 h-24 bg-indigo-600 rounded-4xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mb-8 rotate-3">
                                <Info size={48} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">
                                Master the <span className="text-indigo-600 underline decoration-indigo-100 decoration-8 underline-offset-4">Magnitude</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed mb-12">
                                Learn the difference between Scalar and Vector quantities through two interactive missions.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-left shadow-sm">
                                    <div className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600" /> Stage 1
                                    </div>
                                    <h3 className="font-black text-slate-900 text-xl mb-1">Sorting Station</h3>
                                    <p className="text-sm text-slate-500 font-medium italic">Theory & Classification</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl border border-slate-100 text-left shadow-sm">
                                    <div className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-200" /> Stage 2
                                    </div>
                                    <h3 className="font-black text-slate-900 text-xl mb-1">Vector Mission</h3>
                                    <p className="text-sm text-slate-500 font-medium italic">Path Planning & Grid Work</p>
                                </div>
                            </div>

                            <button
                                onClick={startGame}
                                className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-4xl shadow-xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 text-lg"
                            >
                                START RESEARCH
                            </button>
                        </motion.div>
                    )}

                    {stage === "stage1" && (
                        <SortingStation key="stage1" onComplete={handleStage1Complete} />
                    )}

                    {stage === "stage2" && (
                        <VectorMission key="stage2" onComplete={handleGameComplete} />
                    )}

                    {stage === "gameover" && (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] px-8 text-center"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-4xl flex items-center justify-center text-white shadow-2xl shadow-green-100 mb-8">
                                <Trophy size={48} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Mission Complete!</h2>
                            <p className="text-xl text-slate-500 font-medium mb-12">You've mastered the basics of vectors and scalars.</p>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full mb-12">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">XP Gained</div>
                                <div className="text-4xl font-black text-slate-900">+{score} XP</div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStage("menu")}
                                    className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-900 font-black rounded-3xl transition-all"
                                >
                                    BACK TO HUB
                                </button>
                                <button
                                    onClick={startGame}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-lg shadow-indigo-100 transition-all"
                                >
                                    PLAY AGAIN
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
