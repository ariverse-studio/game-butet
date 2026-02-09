"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { X, Check, Heart, Trophy, Zap, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCoins } from "../../context/CoinContext";

// --- Types ---
interface Equation {
    id: number;
    text: string;
    isCorrect: boolean;
}

// --- Utils ---
const generateEquation = (id: number): Equation => {
    const ops = ["+", "-", "x"]; // Keep it simple for rapid tinder swiping
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let result: number;

    if (op === "+") result = a + b;
    else if (op === "-") {
        if (a < b) [a, b] = [b, a];
        result = a - b;
    } else {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        result = a * b;
    }

    const showCorrect = Math.random() > 0.5;
    const displayedResult = showCorrect ? result : result + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);

    return {
        id,
        text: `${a} ${op === "x" ? "×" : op} ${b} = ${displayedResult}`,
        isCorrect: showCorrect && displayedResult === result,
    };
};

export default function MathMatch() {
    const { addCoins } = useCoins();
    const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
    const [cards, setCards] = useState<Equation[]>([]);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [combo, setCombo] = useState(0);
    const [lastFeedback, setLastFeedback] = useState<"correct" | "wrong" | null>(null);

    // Initial load
    useEffect(() => {
        if (gameState === "playing" && cards.length < 3) {
            setCards((prev) => {
                const newCards = [...prev];
                while (newCards.length < 5) {
                    newCards.push(generateEquation(Date.now() + Math.random()));
                }
                return newCards;
            });
        }
    }, [gameState, cards.length]);

    const handleSwipe = useCallback((direction: "left" | "right") => {
        if (cards.length === 0 || gameState !== "playing") return;

        const currentCard = cards[0];
        const swipedTrue = direction === "right";
        const isCorrect = currentCard.isCorrect === swipedTrue;

        if (isCorrect) {
            const nextCombo = combo + 1;
            const points = nextCombo >= 3 ? 20 : 10;
            setScore((prev) => prev + points);
            setCombo(nextCombo);
            setLastFeedback("correct");
            addCoins(points / 5);
        } else {
            setLives((prev) => {
                const newLives = prev - 1;
                if (newLives <= 0) setGameState("gameover");
                return newLives;
            });
            setCombo(0);
            setLastFeedback("wrong");
            if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200);
        }

        // Remove top card
        setCards((prev) => prev.slice(1));

        // Clear feedback
        setTimeout(() => setLastFeedback(null), 500);
    }, [cards, combo, gameState, addCoins]);

    const startGame = () => {
        setScore(0);
        setLives(3);
        setCombo(0);
        setCards(Array.from({ length: 5 }, (_, i) => generateEquation(i)));
        setGameState("playing");
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-50 flex flex-col font-sans">
            {/* Header / HUD */}
            <div className="p-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-4">
                    <Link href="/simulation" className="p-2 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tight text-slate-900">Math Match</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">The Arithmetic Tinder</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Heart
                                key={i}
                                size={18}
                                className={`transition-colors ${i < lives ? "fill-red-500 text-red-500" : "text-slate-200"}`}
                            />
                        ))}
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" />
                        <span className="font-black text-slate-900">{score}</span>
                    </div>
                </div>
            </div>

            {/* Game Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24 relative">
                <AnimatePresence mode="wait">
                    {gameState === "menu" && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center max-w-sm"
                        >
                            <div className="w-24 h-24 bg-indigo-600 rounded-4xl flex items-center justify-center text-white shadow-2xl shadow-indigo-200 mx-auto mb-8">
                                <Zap size={48} fill="currentColor" />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4">Math Match</h2>
                            <p className="text-slate-500 font-medium mb-12">Swipe Right if the equation is <span className="text-green-600 font-bold">TRUE</span>, Left if it's <span className="text-red-500 font-bold">FALSE</span>.</p>
                            <button
                                onClick={startGame}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 text-lg"
                            >
                                PLAY NOW
                            </button>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <div className="relative w-full max-w-xs aspect-3/4 perspective-1000">
                            {/* Combo Badge */}
                            <AnimatePresence>
                                {combo >= 3 && (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -15 }}
                                        animate={{ scale: 1, rotate: -5 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-12 -right-12 z-50 bg-yellow-400 text-slate-900 font-black px-4 py-2 rounded-2xl shadow-xl border-4 border-white"
                                    >
                                        COMBO x{Math.floor(combo / 3) + 1}!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Card Stack */}
                            <div className="relative w-full h-full">
                                <AnimatePresence>
                                    {cards.slice(0, 2).reverse().map((card, index) => (
                                        <SwipeCard
                                            key={card.id}
                                            equation={card.text}
                                            isFront={index === 1 || cards.length === 1}
                                            onSwipe={handleSwipe}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {gameState === "gameover" && (
                        <motion.div
                            key="gameover"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center max-w-sm"
                        >
                            <div className="w-24 h-24 bg-red-500 rounded-4xl flex items-center justify-center text-white shadow-2xl shadow-red-100 mx-auto mb-8">
                                <X size={48} strokeWidth={3} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-2">Game Over!</h2>
                            <p className="text-lg text-slate-500 font-medium mb-12">Final Score: <span className="text-indigo-600 font-black">{score}</span></p>
                            <button
                                onClick={startGame}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <RefreshCw /> TRY AGAIN
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Icons */}
                <AnimatePresence>
                    {lastFeedback && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className={`absolute pointer-events-none z-50 p-6 rounded-full ${lastFeedback === "correct" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                }`}
                        >
                            {lastFeedback === "correct" ? <Check size={48} strokeWidth={4} /> : <X size={48} strokeWidth={4} />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Desktop Controls */}
            {gameState === "playing" && (
                <div className="p-12 flex justify-center gap-8 bg-white/50 backdrop-blur-sm border-t border-slate-100">
                    <button
                        onClick={() => handleSwipe("left")}
                        className="w-20 h-20 rounded-full bg-white border-2 border-red-500 text-red-500 flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors active:scale-90"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => handleSwipe("right")}
                        className="w-20 h-20 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors active:scale-90"
                    >
                        <Check size={32} strokeWidth={3} />
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Swipe Card Subcomponent ---
function SwipeCard({ equation, isFront, onSwipe }: { equation: string; isFront: boolean; onSwipe: (dir: "left" | "right") => void }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color fade transformation
    const backgroundColor = useTransform(
        x,
        [-100, 0, 100],
        ["rgba(239, 68, 68, 0.1)", "rgba(255, 255, 255, 1)", "rgba(34, 197, 94, 0.1)"]
    );

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) {
            onSwipe("right");
        } else if (info.offset.x < -100) {
            onSwipe("left");
        }
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                backgroundColor,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            }}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={isFront ? { scale: 1, y: 0 } : { scale: 0.95, y: 20 }}
            initial={isFront ? { scale: 1, y: 0 } : { scale: 0.9, y: 40 }}
            whileDrag={{ scale: 1.05 }}
            className={`cursor-grab active:cursor-grabbing rounded-[2.5rem] border-2 border-slate-100 shadow-2xl flex items-center justify-center p-8 text-center select-none ${isFront ? "z-40 bg-white" : "z-30 bg-slate-50 opacity-50"
                }`}
        >
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight drop-shadow-sm">
                {equation}
            </h2>
        </motion.div>
    );
}
