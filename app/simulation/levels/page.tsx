"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGamification } from "../../context/GamificationContext";
import {
    TrendingUp,
    Plus,
    Settings2,
    LineChart as ChartIcon,
    Save,
    RotateCcw,
    ChevronRight,
    Search,
    Edit3,
    Zap,
    Scale
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

type CurveMode = 'LINEAR' | 'EXPONENTIAL' | 'EASE';

export default function LevelCurveDesigner() {
    const { levelCurve, updateLevelCurve } = useGamification();

    const [baseXP, setBaseXP] = useState(100);
    const [growthFactor, setGrowthFactor] = useState(1.1);
    const [mode, setMode] = useState<CurveMode>('EXPONENTIAL');
    const [tempCurve, setTempCurve] = useState<number[]>([]);

    // Initialize tempCurve from context or generate default
    useEffect(() => {
        if (levelCurve && levelCurve.length === 99) {
            setTempCurve([...levelCurve]);
        } else {
            generateCurve('EXPONENTIAL', 100, 1.1);
        }
    }, [levelCurve]);

    const generateCurve = (m: CurveMode, base: number, factor: number) => {
        const newCurve: number[] = [];
        for (let i = 1; i <= 99; i++) {
            let xp = 0;
            if (m === 'LINEAR') {
                xp = Math.floor(base + (i - 1) * factor * 10);
            } else if (m === 'EXPONENTIAL') {
                xp = Math.floor(base * Math.pow(factor, i - 1));
            } else if (m === 'EASE') {
                // S-Curve using smoothstep-like easing
                const t = (i - 1) / 98;
                const ease = t * t * (3 - 2 * t);
                xp = Math.floor(base + ease * (base * 50 * factor));
            }
            newCurve.push(xp);
        }
        setTempCurve(newCurve);
    };

    const handleGenerate = () => {
        generateCurve(mode, baseXP, growthFactor);
    };

    const handleManualEdit = (index: number, value: string) => {
        const val = parseInt(value) || 0;
        const newCurve = [...tempCurve];
        newCurve[index] = val;
        setTempCurve(newCurve);
    };

    const handleSave = () => {
        updateLevelCurve(tempCurve);
    };

    const maxVal = Math.max(...tempCurve, 1);

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-indigo-600">
                            <Scale size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Growth Economics</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Level Curve Designer</h1>
                        <p className="text-slate-500 font-medium">Balance XP thresholds and progression pacing for Level 1 to 99.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => generateCurve(mode, baseXP, growthFactor)}
                            className="p-4 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition shadow-sm"
                            title="Reset to selected curve"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100/50"
                        >
                            <Save size={20} /> Save Curve
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left: Generator Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-10">
                            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                                <Zap className="text-indigo-500" /> Auto-Generator
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">Pacing Model</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['LINEAR', 'EXPONENTIAL', 'EASE'] as CurveMode[]).map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={clsx(
                                                    "py-3 rounded-xl text-[10px] font-black tracking-tighter transition-all border-2",
                                                    mode === m ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-slate-50 bg-slate-50 text-slate-400"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Base XP (Lvl 1)</label>
                                        <input
                                            type="number"
                                            value={baseXP}
                                            onChange={(e) => setBaseXP(parseInt(e.target.value) || 0)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Growth Factor</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={growthFactor}
                                            onChange={(e) => setGrowthFactor(parseFloat(e.target.value) || 0)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-black text-lg"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-xl"
                                >
                                    Preview Generated Curve
                                </button>

                                <div className="pt-6 border-t border-slate-50">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Curve Visualization</h3>
                                    <div className="h-40 w-full bg-slate-50 rounded-2xl border border-slate-100 relative flex items-end px-2 overflow-hidden">
                                        {tempCurve.map((val, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors border-t border-indigo-400"
                                                style={{ height: `${Math.max(2, (val / maxVal) * 100)}%` }}
                                                title={`Level ${i + 1}: ${val} XP`}
                                            />
                                        ))}
                                        <div className="absolute top-2 right-2 text-[8px] font-black text-slate-400 uppercase">
                                            Max: {tempCurve[98]?.toLocaleString()} XP
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Manual Override Table */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <Edit3 className="text-indigo-500" /> Manual Threshold Matrix
                                </h2>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Levels 1 - 99
                                </div>
                            </div>

                            <div className="max-h-[800px] overflow-y-auto custom-scrollbar p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {tempCurve.map((val, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Threshold</div>
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => handleManualEdit(i, e.target.value)}
                                                    className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-sm focus:text-indigo-600 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
