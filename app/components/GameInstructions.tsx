"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, BookOpen, Lightbulb } from "lucide-react";
import { GameMetadata } from "../data/gamesData";

interface GameInstructionsProps {
    game: GameMetadata | null;
    onClose: () => void;
    onStart: () => void;
}

export default function GameInstructions({ game, onClose, onStart }: GameInstructionsProps) {
    if (!game) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className={`${game.color} p-6 text-white flex items-center justify-between`}>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-2xl">
                                <game.icon size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{game.title}</h2>
                                <p className="text-white/80 text-sm font-medium">Game Preview</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto flex-1 space-y-8">
                        {/* Game Design Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-3 text-gray-900">
                                <Lightbulb className="text-yellow-500" size={20} />
                                <h3 className="font-bold text-lg">Game Design</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                {game.design}
                            </p>
                        </section>

                        {/* How to Play Section */}
                        <section>
                            <div className="flex items-center gap-2 mb-3 text-gray-900">
                                <BookOpen className="text-blue-500" size={20} />
                                <h3 className="font-bold text-lg">How to Play</h3>
                            </div>
                            <div className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-2xl border border-blue-100 italic">
                                {game.howToPlay.split('\n').map((line, idx) => (
                                    <p key={idx} className={line.trim() ? "mb-2 last:mb-0" : ""}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Footer / Action */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            Back to Menu
                        </button>
                        <button
                            onClick={onStart}
                            className={`flex-1 px-6 py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 transform active:scale-95 transition-all flex items-center justify-center gap-2 ${game.color} hover:brightness-110`}
                        >
                            <Play size={20} fill="currentColor" />
                            Start Training
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
