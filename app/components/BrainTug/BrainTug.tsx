"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RefreshCw, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useCoins } from "../../context/CoinContext";

// --- Types ---
interface MathProblem {
    id: number;
    text: string;
    answer: number;
    options: number[];
}

interface PlayerState {
    problem: MathProblem | null;
    streak: number;
    isStunned: boolean;
    lastAction: "pull" | "slip" | "hulk" | null;
}

// --- Utils ---
const generateMathProblem = (): MathProblem => {
    const ops = ["+", "-", "x"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = 0, b = 0, answer = 0;

    if (op === "+") {
        a = Math.floor(Math.random() * 50) + 1;
        b = Math.floor(Math.random() * 50) + 1;
        answer = a + b;
    } else if (op === "-") {
        a = Math.floor(Math.random() * 50) + 20;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        answer = a - b;
    } else {
        a = Math.floor(Math.random() * 12) + 2;
        b = Math.floor(Math.random() * 12) + 2;
        answer = a * b;
    }

    const options = new Set<number>([answer]);
    while (options.size < 4) {
        const wrong = answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 1);
        if (wrong > 0) options.add(wrong);
    }

    return {
        id: Date.now() + Math.random(),
        text: `${a} ${op === "x" ? "×" : op} ${b}`,
        answer,
        options: Array.from(options).sort(() => Math.random() - 0.5),
    };
};

export default function BrainTug() {
    const { addCoins } = useCoins();
    const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
    const [ropePosition, setRopePosition] = useState(0); // -100 to 100
    const [winner, setWinner] = useState<"P1" | "P2" | null>(null);

    const [p1, setP1] = useState<PlayerState>({
        problem: null,
        streak: 0,
        isStunned: false,
        lastAction: null,
    });

    const [p2, setP2] = useState<PlayerState>({
        problem: null,
        streak: 0,
        isStunned: false,
        lastAction: null,
    });

    const startGame = () => {
        setRopePosition(0);
        setWinner(null);
        setP1({ problem: generateMathProblem(), streak: 0, isStunned: false, lastAction: null });
        setP2({ problem: generateMathProblem(), streak: 0, isStunned: false, lastAction: null });
        setGameState("playing");
    };

    const handleAnswer = (player: "P1" | "P2", choice: number) => {
        if (gameState !== "playing") return;

        const isP1 = player === "P1";
        const currentPlayer = isP1 ? p1 : p2;
        const setter = isP1 ? setP1 : setP2;

        if (currentPlayer.isStunned || !currentPlayer.problem) return;

        const isCorrect = choice === currentPlayer.problem.answer;

        if (isCorrect) {
            const isHulk = currentPlayer.streak >= 2; // Next pull is hulk if streak was 2 (making it 3rd)
            const pullPower = isHulk ? 20 : 10;

            setRopePosition(prev => {
                const next = prev + (isP1 ? -pullPower : pullPower);
                if (next <= -100) {
                    setWinner("P1");
                    setGameState("gameover");
                    addCoins(50);
                    return -100;
                }
                if (next >= 100) {
                    setWinner("P2");
                    setGameState("gameover");
                    addCoins(50);
                    return 100;
                }
                return next;
            });

            setter(prev => ({
                ...prev,
                streak: isHulk ? 0 : prev.streak + 1,
                problem: generateMathProblem(),
                lastAction: isHulk ? "hulk" : "pull",
            }));
        } else {
            // Slip penalty
            setRopePosition(prev => {
                const next = prev + (isP1 ? 15 : -15);
                return Math.max(-100, Math.min(100, next));
            });

            setter(prev => ({
                ...prev,
                streak: 0,
                isStunned: true,
                lastAction: "slip",
            }));

            setTimeout(() => {
                setter(prev => ({ ...prev, isStunned: false, problem: generateMathProblem() }));
            }, 1000);
        }

        // Reset action feedback
        setTimeout(() => {
            setter(prev => ({ ...prev, lastAction: null }));
        }, 800);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900 flex flex-col font-sans text-white">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <Link href="/simulation" className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all pointer-events-auto">
                    <ArrowLeft size={24} />
                </Link>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic">Brain Tug</h1>
                    <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Tarik Tambang Logika</p>
                </div>
                <div className="w-12" /> {/* Spacer */}
            </div>

            <AnimatePresence mode="wait">
                {gameState === "menu" && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 z-40 bg-slate-900"
                    >
                        <div className="relative mb-8">
                            <motion.div
                                animate={{ rotate: [0, -5, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-32 h-32 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/50"
                            >
                                <Zap size={64} fill="currentColor" />
                            </motion.div>
                            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-900 p-2 rounded-xl font-black text-xs rotate-12 border-4 border-slate-900">
                                1 VS 1
                            </div>
                        </div>
                        <h2 className="text-5xl font-black mb-4 text-center leading-tight">BRAIN TUG</h2>
                        <p className="text-slate-400 font-medium mb-12 text-center max-w-xs">
                            Solve math fast to pull the rope. 3 streaks for <span className="text-yellow-400 font-bold underline">HULK PULL</span>!
                        </p>
                        <button
                            onClick={startGame}
                            className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 text-xl tracking-tight"
                        >
                            START BATTLE
                        </button>
                    </motion.div>
                )}

                {gameState === "playing" && (
                    <div className="flex-1 flex flex-col h-full">
                        {/* Arena */}
                        <div className="h-2/5 relative flex flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-slate-950/50">
                            {/* Mud Pits */}
                            <div className="absolute inset-y-0 left-0 w-16 bg-orange-950/40 border-r border-orange-900/50 blur-sm" />
                            <div className="absolute inset-y-0 right-0 w-16 bg-orange-950/40 border-l border-orange-900/50 blur-sm" />

                            {/* Ground Line */}
                            <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-white/5" />

                            {/* The Rope */}
                            <motion.div
                                className="absolute w-[150%] h-2 bg-yellow-800 rounded-full shadow-lg"
                                animate={{ x: -ropePosition * 4 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            >
                                {/* Knot / Flag */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-red-600 border-2 border-white rounded-sm shadow-md" />
                            </motion.div>

                            {/* Characters */}
                            <div className="relative w-full max-w-4xl h-full flex items-center px-20">
                                {/* Player 1 Character */}
                                <motion.div
                                    className="absolute left-1/4 flex flex-col items-center"
                                    animate={{
                                        x: -ropePosition * 4,
                                        scale: p1.streak >= 3 ? 1.25 : 1
                                    }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    <div className={`w-20 h-20 rounded-2xl bg-blue-500 shadow-lg flex items-center justify-center text-4xl border-4 ${p1.streak >= 3 ? "border-yellow-400 animate-pulse" : "border-white/20"}`}>
                                        🤖
                                    </div>
                                    <div className="mt-2 px-3 py-1 bg-blue-600/50 rounded-lg text-[10px] font-black uppercase">Player 1</div>

                                    {/* Feedback Popups */}
                                    <AnimatePresence>
                                        {p1.lastAction && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 0 }}
                                                animate={{ opacity: 1, y: -60 }}
                                                exit={{ opacity: 0 }}
                                                className={`absolute font-black text-xl whitespace-nowrap ${p1.lastAction === "slip" ? "text-red-500" : p1.lastAction === "hulk" ? "text-yellow-400" : "text-green-400"
                                                    }`}
                                            >
                                                {p1.lastAction === "slip" ? "SLIP!" : p1.lastAction === "hulk" ? "HULK PULL!" : "PULL!"}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Player 2 Character */}
                                <motion.div
                                    className="absolute right-1/4 flex flex-col items-center"
                                    animate={{
                                        x: -ropePosition * 4,
                                        scale: p2.streak >= 3 ? 1.25 : 1
                                    }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    <div className={`w-20 h-20 rounded-2xl bg-red-500 shadow-lg flex items-center justify-center text-4xl border-4 ${p2.streak >= 3 ? "border-yellow-400 animate-pulse" : "border-white/20"}`}>
                                        👹
                                    </div>
                                    <div className="mt-2 px-3 py-1 bg-red-600/50 rounded-lg text-[10px] font-black uppercase">Player 2</div>

                                    {/* Feedback Popups */}
                                    <AnimatePresence>
                                        {p2.lastAction && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 0 }}
                                                animate={{ opacity: 1, y: -60 }}
                                                exit={{ opacity: 0 }}
                                                className={`absolute font-black text-xl whitespace-nowrap ${p2.lastAction === "slip" ? "text-red-500" : p2.lastAction === "hulk" ? "text-yellow-400" : "text-green-400"
                                                    }`}
                                            >
                                                {p2.lastAction === "slip" ? "SLIP!" : p2.lastAction === "hulk" ? "HULK PULL!" : "PULL!"}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        </div>

                        {/* Split Controls */}
                        <div className="flex-1 flex">
                            {/* Player 1 Control */}
                            <div className="flex-1 border-r border-white/5 p-6 flex flex-col items-center justify-center bg-slate-900/50">
                                <PlayerControl
                                    player="P1"
                                    state={p1}
                                    onAnswer={(c) => handleAnswer("P1", c)}
                                    color="blue"
                                />
                            </div>

                            {/* Player 2 Control */}
                            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-900/50">
                                <PlayerControl
                                    player="P2"
                                    state={p2}
                                    onAnswer={(c) => handleAnswer("P2", c)}
                                    color="red"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {gameState === "gameover" && (
                    <motion.div
                        key="gameover"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 z-50 px-20 text-center"
                    >
                        <div className={`w-32 h-32 rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-2xl ${winner === "P1" ? "bg-blue-600 shadow-blue-500/50" : "bg-red-600 shadow-red-500/50"}`}>
                            {winner === "P1" ? "🤖" : "👹"}
                        </div>
                        <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase italic">
                            {winner === "P1" ? "Player 1 Wins!" : "Player 2 Wins!"}
                        </h2>
                        <p className="text-slate-400 mb-4 inline-flex items-center gap-2">
                            <span className="text-yellow-400 font-bold">+50 COINS</span> earned!
                        </p>
                        <p className="text-slate-500 font-medium mb-12">The opponent fell into the mud pit!</p>
                        <button
                            onClick={startGame}
                            className="w-full max-w-xs py-5 bg-white text-slate-900 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg"
                        >
                            <RefreshCw /> PLAY AGAIN
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PlayerControl({
    player,
    state,
    onAnswer,
    color
}: {
    player: string;
    state: PlayerState;
    onAnswer: (c: number) => void;
    color: "blue" | "red";
}) {
    const isBlue = color === "blue";

    return (
        <div className={`w-full max-w-xs flex flex-col items-center transition-opacity ${state.isStunned ? "opacity-30 grayscale pointer-events-none" : "opacity-100"}`}>
            {/* Problem Display */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    {/* Streak Indicator */}
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i < state.streak ? (state.streak >= 3 ? "bg-yellow-400" : (isBlue ? "bg-blue-400" : "bg-red-400")) : "bg-white/10"}`}
                                animate={i < state.streak && state.streak >= 3 ? { scale: [1, 1.5, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        ))}
                    </div>
                </div>
                <h3 className="text-4xl font-black tracking-tight">{state.problem?.text}</h3>
            </div>

            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full">
                {state.problem?.options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onAnswer(option)}
                        className={`py-6 rounded-2xl font-black text-xl transition-all active:scale-90 border-2 ${isBlue
                                ? "bg-blue-600/20 border-blue-500/30 hover:bg-blue-600/40 hover:border-blue-500"
                                : "bg-red-600/20 border-red-500/30 hover:bg-red-600/40 hover:border-red-500"
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {state.isStunned && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-[10px] font-black uppercase text-red-500 tracking-widest"
                >
                    Slip! Stunned...
                </motion.div>
            )}
        </div>
    );
}
