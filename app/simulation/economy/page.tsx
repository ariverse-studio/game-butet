"use client";

import React, { useState, useRef } from "react";
import {
    Plus,
    Minus,
    TrendingUp,
    TrendingDown,
    Wallet,
    Download,
    Upload,
    RotateCcw,
    History,
    AlertCircle,
    CheckCircle2,
    DollarSign,
    ArrowRight,
    Puzzle,
    Award
} from "lucide-react";
import clsx from "clsx";
import { useEconomy, TransactionType, TransactionCategory, SimulationCard, Transaction } from "../../context/EconomyContext";
import { useGamification, Mission } from "../../context/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Trophy, Star, ChevronRight } from "lucide-react";

interface DonutSegment {
    label: string;
    value: number;
    color: string;
    startPercent: number;
    endPercent: number;
}

// ============================================
// HELPERS & CONSTANTS
// ============================================

const RANDOM_NAMES: Record<string, string[]> = {
    LEARNING: [
        "Algebra Puzzles", "Angle Master Quiz", "Division Training",
        "Pattern Recognition", "Data Analysis Basics", "Logic Gate Challenge",
        "Fraction Fundamentals", "Geometry Genius"
    ],
    MINIGAME: [
        "Factor Ninja Highscore", "Coordinate Commando", "Equation Escape",
        "Prime Hunter", "Math Masters Run", "Number Smash"
    ],
    MISSION: [
        "Daily Challenge Complete", "Weekly Boss Defeated", "Secret Scroll Found",
        "Math Master Achievement", "Community Goal Met"
    ],
    AVATAR: [
        "Neon Cape", "Cyber Helmet", "Dragon Pet", "Golden Sword",
        "Galaxy Aura", "Stealth Boots", "Crystal Shield"
    ],
    UNLOCK_GAME: [
        "Calculus Level", "Secret Dungeon", "Pro Mode Access",
        "Multiplayer Arena", "Time Attack Mode"
    ]
};

const getRandomDesc = (cat: string) => {
    const names = RANDOM_NAMES[cat] || ["Unknown Activity"];
    return names[Math.floor(Math.random() * names.length)];
};

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
    subValue?: string;
}

const StatCard = ({ title, value, icon: Icon, color, subValue }: StatCardProps) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
        <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-medium">{title}</span>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {subValue && (
            <div className="mt-2 text-xs text-slate-400 font-medium">
                {subValue}
            </div>
        )}
    </div>
);

// ============================================
// CHART COMPONENTS
// ============================================

const DonutChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    // Calculate segments functionally to avoid reassignment side-effects during render
    const segments: DonutSegment[] = data.reduce((acc: DonutSegment[], item) => {
        const prevEndPercent = acc.length > 0 ? acc[acc.length - 1].endPercent : 0;
        const startPercent = prevEndPercent;
        const endPercent = total > 0 ? startPercent + (item.value / total) : 0;
        acc.push({ ...item, startPercent, endPercent });
        return acc;
    }, []);

    return (
        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
            <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
                {segments.map((item, index) => {
                    const [startX, startY] = getCoordinatesForPercent(item.startPercent);
                    const [endX, endY] = getCoordinatesForPercent(item.endPercent);

                    const largeArcFlag = (item.endPercent - item.startPercent) > 0.5 ? 1 : 0;
                    const pathData = total > 0 && item.value > 0 ? [
                        `M ${startX} ${startY}`,
                        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                        `L 0 0`,
                    ].join(" ") : "";

                    return (
                        <motion.path
                            key={index}
                            d={pathData}
                            fill={item.color}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        />
                    );
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">{total}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Income</span>
            </div>
        </div>
    );
};

const LineChart = ({ transactions }: { transactions: Transaction[] }) => {
    if (transactions.length < 2) return (
        <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 text-xs font-bold uppercase tracking-widest">
            Need more history to plot
        </div>
    );

    const dataPoints = transactions.slice().reverse().reduce((acc: { val: number, time: number }[], tx) => {
        const prevBalance = acc.length > 0 ? acc[acc.length - 1].val : 0;
        acc.push({
            val: prevBalance + (tx.type === 'INCOME' ? tx.amount : -tx.amount),
            time: new Date(tx.timestamp).getTime()
        });
        return acc;
    }, []);

    const min = Math.min(...dataPoints.map(d => d.val), 0);
    const max = Math.max(...dataPoints.map(d => d.val), 100);
    const range = max - min;
    const padding = 20;
    const width = 400;
    const height = 160;

    const points = dataPoints.map((d, i) => {
        const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
        const y = height - (((d.val - min) / (range || 1)) * (height - padding * 2) + padding);
        return `${x},${y}`;
    }).join(" ");

    const areaPoints = `${points} ${width - padding},${height} ${padding},${height}`;

    return (
        <div className="w-full bg-slate-50/50 rounded-3xl p-4 overflow-hidden border border-slate-100/50">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.polyline
                    points={areaPoints}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />
                <motion.polyline
                    points={points}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {dataPoints.map((d, i) => {
                    const x = (i / (dataPoints.length - 1)) * (width - padding * 2) + padding;
                    const y = height - (((d.val - min) / (range || 1)) * (height - padding * 2) + padding);
                    return (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="white"
                            stroke="#6366f1"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default function EconomyDashboard() {
    const {
        transactions,
        simCards,
        balance,
        totalIncome,
        totalExpense,
        addTransaction,
        addSimCard,
        removeSimCard,
        clearData,
        exportData,
        importData
    } = useEconomy();

    const {
        level,
        currentXP,
        maxXP,
        addXP,
        missions,
        completeMission,
        resetAllProgress: resetProgression
    } = useGamification();

    // Level Requirements List (1-20)
    const levelRequirements = Array.from({ length: 20 }, (_, i) => {
        const lvl = i + 1;
        const req = Math.floor(100 * Math.pow(1.1, lvl - 1));
        return { level: lvl, exp: req };
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showMessage = (msg: string, type: "error" | "success") => {
        if (type === "error") setError(msg);
        else setSuccess(msg);
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 3000);
    };

    const handleExecuteMission = (mission: Mission) => {
        if (mission.isClaimed) return;

        // Add to economy context for charts
        addTransaction({
            type: "INCOME",
            category: "MISSION",
            amount: mission.rewardCoins,
            description: `Completed Mission: ${mission.title}`
        });

        // Trigger gamification logic
        completeMission(mission.id);

        showMessage(`${mission.title} completed! (+${mission.rewardXP} XP)`, "success");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                importData(content);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Progression Simulator</h1>
                        <p className="text-slate-500 font-medium">Test mission balancing, XP curves, and economic growth in real-time.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={exportData} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition drop-shadow-sm">
                            <Download size={18} /> Export
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition drop-shadow-sm">
                            <Upload size={18} /> Import
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json" />
                        <button onClick={() => { clearData(); resetProgression(); }} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition">
                            <RotateCcw size={18} /> Reset All
                        </button>
                    </div>
                </div>

                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6 pointer-events-none">
                    <AnimatePresence>
                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className={`p-4 rounded-3xl flex items-center gap-3 border shadow-2xl pointer-events-auto ${error ? "bg-red-50 border-red-200 text-red-700 shadow-red-100" : "bg-white border-slate-100 text-slate-800 shadow-indigo-100"
                                    }`}
                            >
                                <div className={`p-2 rounded-xl ${error ? "bg-red-100" : "bg-indigo-50"}`}>
                                    {error ? <AlertCircle size={20} className="text-red-600" /> : <CheckCircle2 size={20} className="text-indigo-600" />}
                                </div>
                                <span className="font-black text-sm tracking-tight">{error || success}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Column 1: Info & Navigation */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-6">
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Links</h2>
                            <div className="space-y-3">
                                <Link href="/simulation/mission" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Puzzle size={18} className="text-indigo-500" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Mission Lab</span>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400" />
                                </Link>
                                <Link href="/simulation/badge" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-rose-50 hover:border-rose-100 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <Award size={18} className="text-rose-500" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700">Badge Lab</span>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-400" />
                                </Link>
                            </div>

                            <div className="mt-12">
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Manual XP</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => addXP(50)} className="py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100">+50 XP</button>
                                    <button onClick={() => addXP(200)} className="py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100">+200 XP</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Action Center */}
                    <div className="lg:col-span-5 space-y-10">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Missions</h2>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">{missions.length} Playable</span>
                            </div>

                            {missions.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                                    <Puzzle className="mx-auto mb-4 opacity-30" size={48} />
                                    <p className="font-bold">No missions available.</p>
                                    <p className="text-sm px-8">Go to the Mission Lab to design some quests first!</p>
                                    <Link href="/simulation/mission" className="inline-block mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">Open Mission Lab</Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence mode="popLayout">
                                        {missions.map((mission) => (
                                            <motion.div
                                                key={mission.id}
                                                layout
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.95, opacity: 0 }}
                                                className="relative group"
                                            >
                                                <button
                                                    onClick={() => handleExecuteMission(mission)}
                                                    disabled={mission.isClaimed}
                                                    className={clsx(
                                                        "w-full p-6 rounded-[2rem] text-left transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-md mb-2",
                                                        mission.isClaimed ? "bg-slate-50 border-slate-200 grayscale opacity-50" : "bg-white border-green-500 hover:bg-green-50"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-green-100 text-green-700">
                                                                +{mission.rewardCoins} Coins
                                                            </span>
                                                            <span className="text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                                                                +{mission.rewardXP} XP
                                                            </span>
                                                        </div>
                                                        <Trophy className={clsx(mission.isClaimed ? "text-slate-300" : "text-amber-400")} size={20} />
                                                    </div>
                                                    <div className="text-xl font-black text-slate-800 leading-tight">
                                                        {mission.title}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">{mission.description || 'Simulate this mission'}</p>
                                                    {!mission.isClaimed && (
                                                        <div className="text-[10px] font-bold text-indigo-400 mt-4 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Simulate Completion <ArrowRight size={10} />
                                                        </div>
                                                    )}
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Recent Activity Mini Log */}
                        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <History size={20} className="text-indigo-500" /> Progression History
                            </h3>
                            <div className="space-y-3">
                                {transactions.slice(0, 5).map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                {tx.type === 'INCOME' ? <Plus size={14} className="text-green-600" /> : <Minus size={14} className="text-red-600" />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800 line-clamp-1">{tx.description}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{tx.category.replace("_", " ")}</div>
                                            </div>
                                        </div>
                                        <div className={`font-black ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount}
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && <p className="text-center text-slate-400 italic py-4 text-sm">Waiting for simulation data...</p>}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Stats & Requirements */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="flex flex-col gap-4">
                            <StatCard
                                title="Currency Pool"
                                value={balance.toLocaleString()}
                                icon={Wallet}
                                color="bg-indigo-600 shadow-indigo-200"
                            />
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Trophy size={16} className="text-indigo-600" />
                                        </div>
                                        <span className="text-slate-500 text-sm font-medium">Developer Level</span>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900">Lvl {level}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>XP Progress</span>
                                        <span>{Math.floor(currentXP)} / {maxXP} XP</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentXP / maxXP) * 100}%` }}
                                            className="h-full bg-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Level Requirements List */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Gauge size={18} className="text-indigo-500" /> Requirements Matrix
                            </h3>
                            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {levelRequirements.map((req) => (
                                    <div
                                        key={req.level}
                                        className={clsx(
                                            "flex items-center justify-between p-3 rounded-2xl transition-colors",
                                            level === req.level ? "bg-indigo-50 border border-indigo-100" : "hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                                                level >= req.level ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                                            )}>
                                                {req.level}
                                            </div>
                                            <div className="text-xs font-bold text-slate-700">Level {req.level}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs font-black text-slate-900">{req.exp.toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">XP</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Analytics */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Cash Flow Trend</h3>
                                <LineChart transactions={transactions} />
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 text-center">Revenue Share</h3>
                                <DonutChart data={[
                                    { label: "Learning", value: transactions.filter(t => t.category === "LEARNING").reduce((sum, t) => sum + t.amount, 0), color: "#6366f1" },
                                    { label: "Minigame", value: transactions.filter(t => t.category === "MINIGAME").reduce((sum, t) => sum + t.amount, 0), color: "#10b981" },
                                    { label: "Mission", value: transactions.filter(t => t.category === "MISSION").reduce((sum, t) => sum + t.amount, 0), color: "#f59e0b" }
                                ]} />

                                <div className="grid grid-cols-3 gap-2 mt-8">
                                    {[
                                        { label: "LRN", color: "bg-indigo-500" },
                                        { label: "GAM", color: "bg-green-500" },
                                        { label: "MSN", color: "bg-amber-500" }
                                    ].map(item => (
                                        <div key={item.label} className="flex flex-col items-center gap-1">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Simulation Stats */}
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Simulation Summary</h3>
                            <div className="space-y-4 my-6">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-500">Total Income</span>
                                    <span className="text-green-400">+{totalIncome}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span className="text-slate-500">Total Spent</span>
                                    <span className="text-red-400">-{totalExpense}</span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex justify-between items-center text-lg font-black pt-2">
                                    <span>P/L Status</span>
                                    <span className={balance >= 0 ? "text-indigo-400" : "text-red-400"}>
                                        {balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Link from "next/link";
