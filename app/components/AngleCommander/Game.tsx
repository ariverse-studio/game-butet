"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Lock, Check, RotateCcw, ArrowRight } from "lucide-react";
import { useCoins } from "../../context/CoinContext";
import { useSound } from "../../hooks/useSound";
import { generateAngle, checkAccuracy, AngleChallenge } from "./angleLogic";
import Protractor from "./Protractor";
import confetti from "canvas-confetti";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function AngleCommanderGame() {
    const { addCoins } = useCoins();

    // SFX
    const playSuccess = useSound("https://cdn.pixabay.com/audio/2021/08/09/audio_7232134569.mp3");
    const playNear = useSound("https://cdn.pixabay.com/audio/2022/03/15/audio_7318c4e426.mp3");
    const playFail = useSound("https://cdn.pixabay.com/audio/2025/05/31/audio_e9d22d9131.mp3");
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");

    // Game State
    const [gameState, setGameState] = useState<"estimating" | "result">("estimating");
    const [challenge, setChallenge] = useState<AngleChallenge | null>(null);
    const [userAngle, setUserAngle] = useState(0);
    const [feedback, setFeedback] = useState<{ msg: string; color: string } | null>(null);
    const [score, setScore] = useState(0);

    // Initialize
    useEffect(() => {
        startRound();
    }, []);

    const startRound = () => {
        const newChallenge = generateAngle('hard'); // hard = 5 deg increments
        setChallenge(newChallenge);
        setGameState("estimating");
        setUserAngle(0);
        setFeedback(null);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserAngle(parseInt(e.target.value, 10));
    };

    const lockIn = () => {
        if (!challenge) return;
        playClick();

        const { status, diff } = checkAccuracy(challenge.target, userAngle);
        setGameState("result");

        if (status === 'perfect') {
            playSuccess();
            setFeedback({ msg: `Perfect! Exact match!`, color: "text-emerald-500" });
            addCoins(10);
            setScore(s => s + 10);
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#10b981', '#34d399']
            });
        } else if (status === 'close') {
            playNear();
            setFeedback({ msg: `So Close! Off by ${diff}°`, color: "text-yellow-500" });
            addCoins(5);
            setScore(s => s + 5);
        } else {
            playFail();
            setFeedback({ msg: `Too far! Off by ${diff}°`, color: "text-red-500" });
        }
    };

    if (!challenge) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
            {/* Header */}
            <header className="p-6 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <div className="font-bold text-slate-600 text-lg tracking-wider flex items-center gap-2">
                    ANGLE COMMANDER <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-sm">Score: {score}</span>
                </div>
                <button onClick={startRound} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <RotateCcw size={20} />
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 gap-12 w-full max-w-2xl mx-auto">

                {/* Game Area */}
                <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-slate-200 w-full flex flex-col items-center gap-8">
                    <h2 className="text-xl font-medium text-slate-500">
                        {gameState === 'estimating' ? "Match this Angle:" : "Result:"} <span className="font-bold text-indigo-600">{challenge.target}°</span>
                    </h2>

                    <Protractor
                        angle={userAngle}
                        target={gameState === 'estimating' ? challenge.target : challenge.target}
                        showResult={gameState === 'result'}
                    />

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {gameState === 'result' && feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx("text-2xl font-bold", feedback.color)}
                            >
                                {feedback.msg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
                    {gameState === 'estimating' ? (
                        <>
                            <div className="flex justify-between font-mono text-slate-400 text-xs">
                                <span>0°</span>
                                <span>180°</span>
                                <span>360°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={userAngle}
                                onChange={handleSliderChange}
                                className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
                            />
                            <div className="flex justify-center">
                                <button
                                    onClick={lockIn}
                                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    <Lock size={20} /> Lock In {userAngle}°
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                onClick={startRound}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center gap-2"
                            >
                                <ArrowRight size={20} /> Next Angle
                            </button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
