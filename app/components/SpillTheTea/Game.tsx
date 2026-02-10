"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, ChevronLeft, MoreVertical, Send, Trash2, ShieldAlert } from "lucide-react";
import { logicLevels, LogicLevel } from "./data";
import GhostBubble from "@/app/components/SpillTheTea/GhostBubble";
import { useCoins } from "../../context/CoinContext";

interface ChatMessage {
    id: string;
    text: string;
    sender: "bot" | "player" | "system";
    isPremise?: boolean;
}

export default function Game() {
    const { addCoins } = useCoins();
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [reputation, setReputation] = useState(3);
    const [followers, setFollowers] = useState(0);
    const [showConclusion, setShowConclusion] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const currentLevel = logicLevels[currentLevelIdx];

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isTyping, showConclusion]);

    // Start level logic
    useEffect(() => {
        startLevel(0);
    }, []);

    const startLevel = async (index: number) => {
        const level = logicLevels[index];
        setShowConclusion(false);
        setIsWrong(false);

        // Clear previous context if needed or add a divider
        if (index > 0) {
            setChatHistory(prev => [...prev, { id: `sys-${index}`, text: `--- Level ${index + 1} ---`, sender: "system" }]);
        }

        // Simulate receiving premises
        for (let i = 0; i < level.premises.length; i++) {
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1500));
            setIsTyping(false);
            setChatHistory(prev => [...prev, {
                id: `p-${index}-${i}`,
                text: level.premises[i],
                sender: "bot",
                isPremise: true
            }]);
        }

        // Wait a bit before showing the conclusion draft
        await new Promise(r => setTimeout(r, 800));
        setShowConclusion(true);
    };

    const handleAnswer = (swipedValid: boolean) => {
        const isCorrect = swipedValid === currentLevel.is_valid;

        if (isCorrect) {
            // Add to chat history as human sent
            setChatHistory(prev => [...prev, {
                id: `c-${currentLevel.id}`,
                text: currentLevel.conclusion,
                sender: "player"
            }]);

            if (swipedValid) {
                setFollowers(prev => prev + 10);
                addCoins(5);
            } else {
                setChatHistory(prev => [...prev, {
                    id: `bot-res-${currentLevel.id}`,
                    text: "Hoax Deleted! Good job!",
                    sender: "bot"
                }]);
                setFollowers(prev => prev + 5);
                addCoins(2);
            }

            // Next level after delay
            setTimeout(() => {
                if (currentLevelIdx < logicLevels.length - 1) {
                    setCurrentLevelIdx(prev => prev + 1);
                    startLevel(currentLevelIdx + 1);
                } else {
                    setChatHistory(prev => [...prev, { id: "end", text: "You solved all logic puzzles! Boss level status achieved.", sender: "bot" }]);
                }
            }, 2000);
        } else {
            // WRONG
            setIsWrong(true);
            setReputation(prev => Math.max(0, prev - 1));

            setChatHistory(prev => [...prev, {
                id: `bot-roast-${Date.now()}`,
                text: `SALAH WOY! ${currentLevel.explanation}`,
                sender: "bot"
            }]);

            // Shake ends
            setTimeout(() => setIsWrong(false), 500);

            if (reputation <= 1) {
                setChatHistory(prev => [...prev, { id: "game-over", text: "Reputation Hancur! Kamu di-kick dari grup.", sender: "system" }]);
            }
        }

        setShowConclusion(false);
    };

    return (
        <motion.div
            animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="relative w-full max-w-md h-[800px] bg-slate-100 dark:bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl overflow-hidden flex flex-col"
        >
            {/* Header / App Bar */}
            <div className="bg-emerald-600 dark:bg-emerald-800 p-4 pt-10 text-white flex items-center gap-3 shadow-md">
                <ChevronLeft className="w-6 h-6" />
                <div className="flex-1">
                    <h1 className="font-bold text-lg leading-tight">Grup Ghibah Logika</h1>
                    <p className="text-xs opacity-80">3 Members • Online</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Heart
                                key={i}
                                className={`w-4 h-4 ${i < reputation ? "fill-red-500 text-red-500" : "text-zinc-400"}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{followers}</span>
                    </div>
                </div>
                <MoreVertical className="w-5 h-5 opacity-70" />
            </div>

            {/* Chat Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] dark:bg-zinc-950/50"
                style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay" }}
            >
                {chatHistory.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender === "player" ? "justify-end" : msg.sender === "system" ? "justify-center" : "justify-start"}`}
                    >
                        {msg.sender === "system" ? (
                            <span className="bg-zinc-800/20 dark:bg-white/10 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-400">
                                {msg.text}
                            </span>
                        ) : (
                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm relative ${msg.sender === "player"
                                ? "bg-emerald-500 text-white rounded-tr-none"
                                : "bg-white dark:bg-zinc-800 dark:text-zinc-200 rounded-tl-none"
                                }`}>
                                {msg.text}
                                <div className={`absolute top-0 w-2 h-2 ${msg.sender === "player"
                                    ? "right-[-4px] bg-emerald-500"
                                    : "left-[-4px] bg-white dark:bg-zinc-800"
                                    }`} style={{ clipPath: msg.sender === "player" ? "polygon(0 0, 0 100%, 100% 0)" : "polygon(0 0, 100% 100%, 100% 0)" }} />
                            </div>
                        )}
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex gap-1">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {showConclusion && (
                        <div className="flex justify-end pt-4">
                            <GhostBubble
                                text={currentLevel.conclusion}
                                onChoice={handleAnswer}
                            />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input Bar Placeholder */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 flex items-center gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex-1 bg-white dark:bg-zinc-800 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 px-4 flex items-center text-zinc-400 text-sm">
                    {showConclusion ? "Swipe message to decide..." : "Waiting for logic..."}
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <Send className="w-5 h-5" />
                </div>
            </div>

            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-800 rounded-full" />
        </motion.div>
    );
}
