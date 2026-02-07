"use client";

import Link from "next/link";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useState, useEffect } from "react";
import { useSound } from "../hooks/useSound";

export default function SettingsPage() {
    const { defaultTime, setDefaultTime } = useSettings();
    const [localTime, setLocalTime] = useState(defaultTime);
    const playClick = useSound("https://cdn.pixabay.com/audio/2025/05/23/audio_ec08d1525d.mp3");

    // Sync if context updates externally (though rare here)
    useEffect(() => {
        setLocalTime(defaultTime);
    }, [defaultTime]);

    const handleSave = () => {
        playClick();
        setDefaultTime(localTime);
        // Maybe visual feedback?
    };

    const handleReset = () => {
        playClick();
        setLocalTime(60);
        setDefaultTime(60);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <header className="p-6 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-50">
                <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="text-slate-500" />
                </Link>
                <h1 className="font-bold text-xl text-slate-700">Settings</h1>
            </header>

            <main className="max-w-2xl mx-auto p-6 mt-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-700 mb-1">Game Timer</h2>
                        <p className="text-slate-500 text-sm">Set the time limit for each level (in seconds).</p>
                    </div>

                    <div className="p-8 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <span className="text-4xl font-black text-indigo-600">{localTime}s</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setLocalTime(prev => Math.max(10, prev - 10))}
                                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => setLocalTime(prev => Math.min(300, prev + 10))}
                                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <input
                            type="range"
                            min="10"
                            max="300"
                            step="5"
                            value={localTime}
                            onChange={(e) => setLocalTime(parseInt(e.target.value))}
                            className="w-full h-4 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />

                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                            <span>10s (Blitz)</span>
                            <span>60s (Standard)</span>
                            <span>300s (Zen)</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                        <button
                            onClick={handleReset}
                            className="text-slate-500 hover:text-slate-700 font-medium flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:bg-slate-200/50 transition-colors"
                        >
                            <RotateCcw size={16} /> Reset Default
                        </button>

                        <Link href="/">
                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-md shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <Save size={18} /> Save Settings
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
